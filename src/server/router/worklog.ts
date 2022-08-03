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
        where: {
          creatorId: input.creatorId,
        },
      })

      return {
        ...worklogs,
      }
    },
  })
  .query("getForTimekeeper", {
    input: z.object({
      storyIds: z.array(z.string()),
      startDate: z.date(),
      endDate: z.date(),
    }),
    output: z.object({
      data: z.array(
        z.object({
          storyId: z.string(),
          worklogs: z.array(
            z.object({
              date: z.date(),
              sum: z.number(),
            })
          ),
        })
      ),
    }),
    async resolve({ ctx, input }) {
      const worklogs = await prisma.worklog.findMany({
        where: {
          storyId: {
            in: input.storyIds,
          },
          createdAt: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
      })

      console.log(worklogs)

      return {}
    },
  })
  .query("getAll", {
    async resolve({ ctx, input }) {
      // TODO(SP): implement paging + filtering

      const worklogs = await prisma.worklog.findMany()

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
          duration: input.duration,
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
