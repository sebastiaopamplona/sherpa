import {
  Sprint,
  SprintActionLog,
  SprintActionLogReg,
  SprintStateBreakdown,
  SprintStateBreakdownOutput,
} from "../schemas/schemas"
import { SprintActionLogType as SprintActionLogTypeEnum, StoryState as StoryStateEnum } from "@prisma/client"
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

import { NoSprint } from "../data/data"
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
  .query("getActionsLogs", {
    input: z.object({
      sprintId: z.string(),
    }),
    output: z.array(SprintActionLog),
    async resolve({ ctx, input }) {
      let sprintActionsLogs = await prisma.sprintActionLog.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          sprintId: input.sprintId,
        },
      })
      return sprintActionsLogs
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

export const registerSprintActionLog: (sal: SprintActionLogReg) => void = async (sal) => {
  const salStored = await prisma.sprintActionLog.create({
    data: {
      authorId: sal.authorId,
      sprintId: sal.sprintId,
      storyId: sal.storyId,

      type: sal.type,
      description: sal.description,
      createdAt: sal.createdAt,
    },
  })
}

export type SprintCreateOutput = inferMutationOutput<"sprint.create">
export type SprintGetAllOutput = inferQueryOutput<"sprint.getAll">
export type SprintGetByIdOutput = inferQueryOutput<"sprint.getById">
export type SprintGetByProjectIdOutput = inferQueryOutput<"sprint.getByProjectId">
export type SprintUpdateOutput = inferMutationOutput<"sprint.update">
export type SprintDeleteByIdOutput = inferMutationOutput<"sprint.deleteById">

export const BuildSprintActionLogDescription: (
  type: SprintActionLogTypeEnum,
  authorId: string,
  sprintId: string,
  storyId: string,
  oldStoryState?: string,
  oldAssigneeId?: string
) => Promise<string> = async (type, authorId, sprintId, storyId, oldStoryState, oldAssigneeId) => {
  const author = await prisma.user.findUnique({ where: { id: authorId } })
  if (!author) throw new TRPCError({ code: "NOT_FOUND", message: `Author with id ${authorId} not found` })

  const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } })
  if (!sprint) throw new TRPCError({ code: "NOT_FOUND", message: `Sprint with id ${sprintId} not found` })

  const story = await prisma.story.findUnique({ where: { id: storyId }, include: { assignee: true } })
  if (!story) throw new TRPCError({ code: "NOT_FOUND", message: `Story with id ${storyId} not found` })

  switch (type) {
    case SprintActionLogTypeEnum.STORY_CREATED:
      return `${author.name} created story ${story.title}`
    case SprintActionLogTypeEnum.STORY_DELETED:
      return `${author.name} delete story ${story.title}`
    case SprintActionLogTypeEnum.STORY_ASSIGNEE_CHANGED:
      const oldAssignee = await prisma.user.findUnique({ where: { id: oldAssigneeId } })
      if (!oldAssignee)
        throw new TRPCError({ code: "NOT_FOUND", message: `Old assignee with id ${oldAssigneeId} not found` })

      return `${author.name} assigned story ${story.title} from ${oldAssignee.name} to ${story.assignee}`
    case SprintActionLogTypeEnum.STORY_STATE_CHANGED:
      return `${author.name} changed story ${story.title} state from ${oldStoryState} to ${story.state}`
    default:
      throw new TRPCError({ code: "BAD_REQUEST", message: `Unexpected sprint action log type ${type}` })
  }
}
