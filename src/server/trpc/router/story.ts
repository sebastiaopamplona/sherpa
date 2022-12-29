import { NoSprint, NoUser } from "../../data/data"
import { protectedProcedure, router } from "../trpc"

import { RouterOutputs } from "../../../utils/trpc"
import { Story } from "../../schemas/schemas"
import { TRPCError } from "@trpc/server"
import { prisma } from "../../db/client"
import { updateSprintStateBreakdown } from "./sprint"
import { z } from "zod"

export const storyRouter = router({
  create: protectedProcedure
    .input(Story)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const story = await prisma.story.create({
        data: {
          title: input.title,
          description: input.description,
          estimate: input.estimate,

          projectId: input.projectId,
          creatorId: input.creatorId,
          assigneeId: input.assigneeId === NoUser.id ? null : input.assigneeId,
          sprintId: input.sprintId === NoSprint.id ? null : input.sprintId,

          githubId: input.githubId,
          jiraId: input.jiraId,

          state: input.state,
          type: input.type,
        },
      })

      if (input.sprintId !== NoSprint.id) {
        updateSprintStateBreakdown(input.sprintId)
      }

      return {
        id: story.id,
      }
    }),
  getAll: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
    // TODO(SP): implement paging + filtering

    const stories = await prisma.story.findMany({
      where: {
        projectId: input.projectId,
      },
      include: {
        assignee: true,
        creator: true,
        project: true,
        sprint: true,
        worklogs: {
          orderBy: {
            date: "desc",
          },
          include: {
            creator: true,
          },
        },
      },
    })

    return stories
  }),
  getForTimeKeeper: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        sprintId: z.string().nullish(),
        assigneeId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const stories = await prisma.story.findMany({
        where: {
          projectId: input.projectId,
          sprintId: input.sprintId,
          assigneeId: input.assigneeId,
        },
        orderBy: [{ state: "asc" }, { title: "asc" }],
        include: {
          assignee: true,
          creator: true,
          project: true,
          sprint: true,
          worklogs: {
            orderBy: {
              date: "desc",
            },
            // where: {
            //   date: {
            //     gte: input.startDate,
            //     lte: input.endDate,
            //   },
            // },
            include: {
              creator: true,
            },
          },
        },
      })

      return stories
    }),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const story = await prisma.story.findUnique({
      where: {
        id: input.id,
      },
      include: {
        assignee: true,
        creator: true,
        project: true,
        sprint: true,
        worklogs: true,
      },
    })

    return story
  }),
  update: protectedProcedure
    .input(Story)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const story = await prisma.story.update({
        where: {
          id: input.id as string,
        },
        data: {
          title: input.title ? input.title : undefined,
          description: input.description ? input.description : undefined,
          estimate: input.estimate ? input.estimate : undefined,

          assigneeId: input.assigneeId ? (input.assigneeId === NoUser.id ? null : input.assigneeId) : undefined,
          sprintId: input.sprintId ? (input.sprintId === NoSprint.id ? null : input.sprintId) : undefined,

          githubId: input.githubId ? input.githubId : undefined,
          jiraId: input.jiraId ? input.jiraId : undefined,

          state: input.state ? input.state : undefined,
          type: input.type ? input.type : undefined,
        },
      })

      if (!story) throw new TRPCError({ code: "NOT_FOUND" })

      // state has changed or story was moved to another sprint
      if (input.state || (story.sprintId && input.sprintId !== NoSprint.id)) {
        updateSprintStateBreakdown(story.sprintId!)
      }

      return {
        id: story.id,
      }
    }),
  deleteById: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const story = await prisma.story.delete({
      where: {
        id: input.id,
      },
    })

    if (story.sprintId) {
      updateSprintStateBreakdown(story.sprintId)
    }
  }),
})

export type StoryGetByIdOutput = RouterOutputs["story"]["getById"]
export type StoryGetForTimekeeperOutput = RouterOutputs["story"]["getForTimeKeeper"]
