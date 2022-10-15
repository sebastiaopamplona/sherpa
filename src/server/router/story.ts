import { NoSprint, NoUser } from "../data/data"
import { SprintActionLogReg, Story } from "../schemas/schemas"
import { inferMutationOutput, inferQueryOutput } from "../../pages/_app"
import { registerSprintActionLog, updateSprintStateBreakdown } from "./sprint"

import { TRPCError } from "@trpc/server"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"

export const storyRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: Story,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
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

        let sal: SprintActionLogReg = {
          userId: input.creatorId,
          sprintId: input.sprintId,
          storyId: story.id,

          type: "STORY",
        }
        registerSprintActionLog(sal)
      }

      return {
        id: story.id,
      }
    },
  })

  // READ
  .query("getAll", {
    input: z.object({
      projectId: z.string(),
    }),
    async resolve({ ctx, input }) {
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
    },
  })
  // NOTE(SP): there's a separate query for the timekeeper page in order
  // to optimize it in the future
  .query("getForTimekeeper", {
    input: z.object({
      projectId: z.string(),
      sprintId: z.string().nullish(),
      assigneeId: z.string(),
      startDate: z.date(),
      endDate: z.date(),
    }),
    async resolve({ ctx, input }) {
      const stories = await prisma.story.findMany({
        where: {
          projectId: input.projectId,
          sprintId: input.sprintId,
          assigneeId: input.assigneeId,
        },
        orderBy: {
          state: "asc",
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
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
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
    },
  })

  // UPDATE
  .mutation("update", {
    input: Story,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
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

      console.log(input)

      if (!story) throw new TRPCError({ code: "NOT_FOUND" })

      // story was moved to another sprint
      if (story.sprintId && input.sprintId !== NoSprint.id) {
        updateSprintStateBreakdown(story.sprintId!)
      }

      // state has changed or assignee has changed (FIXME: this will change in the future, ex.: a story may be assigned to multiple users)
      if (input.state || input.assigneeId) {
        console.log("if statement")
        updateSprintStateBreakdown(story.sprintId!)

        let sal: SprintActionLogReg = {
          userId: story.creatorId,
          sprintId: story.sprintId,
          storyId: story.id,

          storyAssigneeId: input.assigneeId,
          storyState: input.state,

          type: "STORY",
        }
        registerSprintActionLog(sal)
      }

      return {
        id: story.id,
      }
    },
  })

  // DELETE
  .mutation("deleteById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const story = await prisma.story.delete({
        where: {
          id: input.id,
        },
      })

      if (story.sprintId) {
        updateSprintStateBreakdown(story.sprintId)
      }
    },
  })

export type StoryCreateOutput = inferMutationOutput<"story.create">
export type StoryGetAllOutput = inferQueryOutput<"story.getAll">
export type StoryGetByIdOutput = inferQueryOutput<"story.getById">
export type StoryGetForTimekeeperOutput = inferQueryOutput<"story.getForTimekeeper">
export type StoryUpdateOutput = inferMutationOutput<"story.update">
export type StoryDeleteByIdOutput = inferMutationOutput<"story.deleteById">
