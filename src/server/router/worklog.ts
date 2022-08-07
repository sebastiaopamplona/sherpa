import { inferMutationOutput, inferQueryOutput } from "../../pages/_app"

import { Worklog } from "../schemas/schemas"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"

export const worklogRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: Worklog,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const worklog = await prisma.worklog.create({
        data: {
          description: input.description,
          date: input.date,
          effort: input.effort,
          remainingEffort: input.remainingEffort,

          creatorId: input.creatorId,
          storyId: input.storyId,
        },
      })

      return {
        id: worklog.id,
      }
    },
  })

  // READ
  .query("getAll", {
    async resolve({ ctx, input }) {
      // TODO(SP): implement paging + filtering

      const worklogs = await prisma.worklog.findMany({
        orderBy: {
          createdAt: "desc",
        },
      })

      return {
        ...worklogs,
      }
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const worklog = await prisma.worklog.findUnique({
        where: {
          id: input.id,
        },
      })

      return {
        ...worklog,
      }
    },
  })
  .query("getByStoryId", {
    input: z.object({
      storyId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const worklogs = await prisma.worklog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          storyId: input.storyId,
        },
        include: {
          creator: true,
        },
      })

      return worklogs
    },
  })
  .query("getByCreatorId", {
    input: z.object({
      creatorId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const worklogs = await prisma.worklog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          creatorId: input.creatorId,
        },
      })

      return {
        ...worklogs,
      }
    },
  })

  // UPDATE
  .mutation("update", {
    input: Worklog,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const worklog = await prisma.worklog.update({
        where: {
          id: input.id as string,
        },
        data: {
          description: input.description,
          effort: input.effort,
          remainingEffort: input.remainingEffort,
        },
      })

      return {
        id: worklog.id,
      }
    },
  })

  // DELETE
  .mutation("deleteById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await prisma.worklog.delete({
        where: {
          id: input.id,
        },
      })
    },
  })

export type WorklogCreateOutput = inferMutationOutput<"worklog.create">
export type WorklogGetAllOutput = inferQueryOutput<"worklog.getAll">
export type WorklogGetByIdOutput = inferQueryOutput<"worklog.getById">
export type WorklogGetByStoryIdOutput = inferQueryOutput<"worklog.getByStoryId">
export type WorklogGetByCreatorIdOutput = inferQueryOutput<"worklog.getByCreatorId">
export type WorklogUpdateOutput = inferMutationOutput<"worklog.update">
export type WorklogDeleteByIdOutput = inferMutationOutput<"worklog.deleteById">
