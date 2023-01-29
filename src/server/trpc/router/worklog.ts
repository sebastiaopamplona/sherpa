import { getDayOfYear, setHours, setMinutes, setSeconds } from "date-fns"
import { protectedProcedure, router } from "../trpc"

import { Worklog } from "../../schemas/schemas"
import { prisma } from "../../db/client"
import { z } from "zod"

export const worklogRouter = router({
  create: protectedProcedure
    .input(Worklog)
    .output(Worklog)
    .mutation(async ({ ctx, input }) => {
      const worklog = await prisma.worklog.create({
        include: {
          creator: true,
        },
        data: {
          description: input.description,
          date: input.date,
          effort: input.effort,
          remainingEffort: input.remainingEffort,

          creatorId: input.creatorId,
          storyId: input.storyId,
        },
      })

      await prisma.story.update({
        where: {
          id: input.storyId,
        },
        data: {
          remainingEffort: input.remainingEffort,
        },
      })

      return worklog
    }),
  getAll: protectedProcedure.query(async ({ ctx, input }) => {
    // TODO(SP): implement paging + filtering

    const worklogs = await prisma.worklog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      ...worklogs,
    }
  }),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const worklog = await prisma.worklog.findUnique({
      where: {
        id: input.id,
      },
    })

    return {
      ...worklog,
    }
  }),
  getByStoryId: protectedProcedure.input(z.object({ storyId: z.string() })).query(async ({ ctx, input }) => {
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
  }),
  getByCreatorId: protectedProcedure.input(z.object({ creatorId: z.string() })).query(async ({ ctx, input }) => {
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
  }),
  getDaySum: protectedProcedure
    .input(
      z.object({
        creatorId: z.string(),
        sprintId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .output(
      z.array(
        z.object({
          dayOfYear: z.number(),
          effort: z.number(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const worklogs = await prisma.worklog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          creatorId: input.creatorId,
          story: {
            sprintId: input.sprintId,
          },
          date: {
            gte: setHours(setMinutes(setSeconds(input.startDate, 0), 0), 0),
            lte: setHours(setMinutes(setSeconds(input.endDate, 0), 0), 0),
          },
        },
      })

      let daySum = new Map<number, number>()
      for (let i = 0; i < 5; i++) {
        daySum.set(getDayOfYear(input.startDate) + i, 0)
      }

      worklogs.forEach((worklog) => {
        const key: number = getDayOfYear(worklog.date)
        daySum.set(key, daySum.get(key)! + worklog.effort)
      })

      return Array.from(daySum.entries()).map(([dayOfYear, effort]) => ({
        dayOfYear,
        effort,
      }))
    }),
  update: protectedProcedure
    .input(Worklog)
    .output(Worklog)
    .mutation(async ({ ctx, input }) => {
      const worklog = await prisma.worklog.update({
        where: {
          id: input.id as string,
        },
        include: {
          creator: true,
        },
        data: {
          description: input.description,
          effort: input.effort,
          remainingEffort: input.remainingEffort,
          date: input.date,
        },
      })

      await prisma.story.update({
        where: {
          id: input.storyId,
        },
        data: {
          remainingEffort: input.remainingEffort,
        },
      })

      return worklog
    }),
  deleteById: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await prisma.worklog.delete({
      where: {
        id: input.id,
      },
    })

    return { id: input.id }
  }),
})
