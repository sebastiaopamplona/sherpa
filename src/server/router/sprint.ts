import { Sprint, SprintActionLogOutput, SprintStateBreakdown, SprintStateBreakdownOutput } from "../schemas/schemas"
import {
  addBusinessDays,
  differenceInBusinessDays,
  format,
  isAfter,
  isSameDay,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns"
import { inferMutationOutput, inferQueryOutput } from "../../pages/_app"

import { StoryState as StoryStateEnum } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"

export const sprintRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: Sprint,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
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
  .query("getAll", {
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
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

  // UPDATE
  .mutation("update", {
    input: Sprint,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

  // DELETE
  .mutation("deleteById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
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

export const registerSprintActionLog: (authorId: string, sprintId: string, storyId: string) => void = async (
  authorId,
  sprintId,
  storyId
) => {
  let sal: SprintActionLogOutput = {
    userId: authorId,
    sprintId: sprintId,
    storyId: storyId,

    createdAt: new Date(),
  }

  const salStored = await prisma.sprintActionLog.create({ data: { ...sal } })
}

export type SprintCreateOutput = inferMutationOutput<"sprint.create">
export type SprintGetAllOutput = inferQueryOutput<"sprint.getAll">
export type SprintGetByIdOutput = inferQueryOutput<"sprint.getById">
export type SprintGetByProjectIdOutput = inferQueryOutput<"sprint.getByProjectId">
export type SprintUpdateOutput = inferMutationOutput<"sprint.update">
export type SprintDeleteByIdOutput = inferMutationOutput<"sprint.deleteById">
