import { Sprint, SprintStateBreakdown, SprintStateBreakdownOutput } from "../schemas/schemas"
import {
  addBusinessDays,
  differenceInBusinessDays,
  format,
  isAfter,
  isSameDay,
  setHours,
  setMinutes,
  setSeconds,
  subDays,
} from "date-fns"
import { inferQueryOutput } from "../../pages/_app"

import { StoryState as StoryStateEnum } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"
import { NoSprint, StoryStatesSorterDoneToBlocked } from "../data/data"

export const sprintRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: Sprint,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (input.title === NoSprint.title) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `The title '${NoSprint.title}' is reserved.` })
      }

      const sprint = await prisma.sprint.create({
        data: {
          title: input.title,
          startAt: input.startAt,
          endAt: input.endAt,

          projectId: input.projectId,
          creatorId: input.creatorId,
        },
      })

      updateSprintStateBreakdown(sprint.id)

      return {
        id: sprint.id,
      }
    },
  })

  // READ
  .query("getByProjectId", {
    input: z.object({
      projectId: z.string(),
    }),
    output: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    ),
    async resolve({ ctx, input }) {
      const sprints = prisma.sprint.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          projectId: input.projectId,
        },
      })

      return sprints
    },
  })
  .query("getStateBreakdown", {
    input: z.object({
      sprintId: z.string(),
    }),
    output: z.array(SprintStateBreakdown),
    async resolve({ ctx, input }) {
      const sprint = await prisma.sprint.findUnique({
        where: {
          id: input.sprintId,
        },
      })

      if (!sprint) throw new TRPCError({ code: "NOT_FOUND" })

      const sprintStateBreakdown = await prisma.sprintStateBreakdown.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          sprintId: input.sprintId,
        },
      })

      const today = new Date()
      const sprintDays = differenceInBusinessDays(sprint.endAt, sprint.startAt) + 1
      let sprintStoryStateMap = new Map<string, SprintStateBreakdownOutput>()
      for (const s of sprintStateBreakdown) {
        sprintStoryStateMap.set(dateAsKey(s.createdAt), { ...s })
      }

      let out = new Array<SprintStateBreakdownOutput>()
      let lastState: SprintStateBreakdownOutput | undefined
      let d: number = 0
      for (
        ;
        (d < sprintDays && !isAfter(addBusinessDays(sprint.startAt, d), today)) ||
        isSameDay(addBusinessDays(sprint.startAt, d), today);
        d++
      ) {
        const key: string = dateAsKey(addBusinessDays(sprint.startAt, d))
        if (sprintStoryStateMap.has(key)) {
          lastState = sprintStoryStateMap.get(key)
        }
        out.push({ day: datePretty(addBusinessDays(sprint.startAt, d)), ...lastState! })
      }

      for (let i = d; i < sprintDays; i++) {
        out.push({ day: datePretty(addBusinessDays(sprint.startAt, i)) })
      }

      return out
    },
  })
  .query("getUserBreakdown", {
    input: z.object({
      projectId: z.string(),
      sprintId: z.string(),
    }),
    output: z.array(
      z.object({
        user: z.object({
          id: z.string(),
          name: z.string(),
          image: z.string(),
          capacity: z.number(),
        }),
        stories: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            estimate: z.number(),
            investedEffort: z.number(),
            remainingEffort: z.number(),
            totalEffort: z.number(),
            type: z.string(),
            state: z.string(),
          })
        ),
      })
    ),
    async resolve({ ctx, input }) {
      const sprint = await prisma.sprint.findUnique({
        where: {
          id: input.sprintId,
        },
      })

      if (typeof sprint === null) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Sprint not found." })
      }

      const users = await prisma.user.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          image: true,
          userProjectCapacity: {
            where: {
              projectId: input.projectId,
              date: {
                gte: subDays(sprint!.startAt, 1),
                lte: sprint!.endAt,
              },
            },
            select: {
              capacity: true,
            },
          },
          assignedStories: {
            select: {
              id: true,
              title: true,
              estimate: true,
              type: true,
              state: true,
              worklogs: {
                orderBy: {
                  createdAt: "asc",
                },
                select: {
                  createdAt: true,
                  effort: true,
                  remainingEffort: true,
                },
              },
            },
            where: {
              sprintId: input.sprintId,
            },
          },
        },
        where: {
          roleInProjects: {
            some: {
              projectId: input.projectId,
            },
          },
        },
      })

      if (typeof users === "undefined") {
        throw new TRPCError({ code: "NOT_FOUND", message: "No users found" })
      }

      type user = {
        id: string
        name: string
        image: string
        capacity: number
      }

      let usersParsed: Array<{ user: user; stories: Array<UserBreakdownStory> }> = []
      users.map((u) => {
        let stories: Array<UserBreakdownStory> = []

        u.assignedStories.map((s) => {
          let investedEffort: number = 0
          s.worklogs.map((w) => (investedEffort += w.effort))

          let remainingEffort: number = s.estimate
          if (s.worklogs.length > 0) remainingEffort = s.worklogs[s.worklogs.length - 1]!.remainingEffort

          stories.push({
            id: s.id,
            title: s.title,
            estimate: s.estimate,
            investedEffort: investedEffort,
            remainingEffort: remainingEffort,
            totalEffort: investedEffort + remainingEffort,
            type: s.type,
            state: s.state,
          })
        })

        let capacity: number = 0
        u.userProjectCapacity.map((c) => (capacity += c.capacity))

        usersParsed.push({
          user: {
            id: u.id,
            name: u.name,
            image: u.image,
            capacity: capacity,
          },
          stories: stories.sort((s1, s2) =>
            StoryStatesSorterDoneToBlocked.get(s1.state)! > StoryStatesSorterDoneToBlocked.get(s2.state)! ? 1 : -1
          ),
        })
      })

      return usersParsed
    },
  })

const dateAsKey: (d: Date) => string = (d) => {
  return format(d, "dd/MM")
}

const datePretty: (d: Date) => string = (d) => {
  return `${format(d, "eeeeee")}, ${format(d, "d/M")}`
}

export const updateSprintStateBreakdown: (sprintId: string) => void = async (sprintId) => {
  type StoryStateCount = Array<{ state: string; count: bigint }>
  const count = await prisma.$queryRaw`
          SELECT
            "public"."Story"."state", COUNT("public"."Story"."id")
          FROM
            "public"."Story"
          WHERE
            "public"."Story"."sprintId" = ${sprintId}
          GROUP BY "public"."Story"."state"`

  let sbd: SprintStateBreakdownOutput = {
    sprintId: sprintId,
    createdAt: new Date(),
  }

  for (const c of count as StoryStateCount) {
    switch (c.state) {
      case StoryStateEnum.IN_PROGRESS:
        sbd.inProgress = Number(c.count)
        break
      case StoryStateEnum.NEW:
        sbd.new = Number(c.count)
        break
      case StoryStateEnum.READY:
        sbd.ready = Number(c.count)
        break
      case StoryStateEnum.DELIVERED:
        sbd.delivered = Number(c.count)
        break
      case StoryStateEnum.IN_REVIEW:
        sbd.inReview = Number(c.count)
        break
      case StoryStateEnum.DONE:
        sbd.done = Number(c.count)
        break
      case StoryStateEnum.BLOCKED:
        sbd.blocked = Number(c.count)
        break
    }
  }

  const sbdStored = await prisma.sprintStateBreakdown.create({ data: { ...sbd } })
  await prisma.sprintStateBreakdown.deleteMany({
    where: {
      id: {
        not: sbdStored.id,
      },
      createdAt: {
        gte: setHours(setMinutes(setSeconds(new Date(), 0), 0), 0),
      },
    },
  })
}

export type SprintGetByProjectIdOutput = inferQueryOutput<"sprint.getByProjectId">
export type SprintGetUserBreakdownOutput = inferQueryOutput<"sprint.getUserBreakdown">

export type UserBreakdownStory = {
  id: string
  title: string
  estimate: number
  investedEffort: number
  remainingEffort: number
  totalEffort: number
  type: string
  state: string
}
