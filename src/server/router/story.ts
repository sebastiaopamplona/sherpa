import { inferMutationOutput, inferQueryOutput } from "../../pages/_app"

import { Story } from "../schemas/schemas"
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
          assigneeId: input.assigneeId,
          sprintId: input.sprintId,

          githubId: input.githubId,
          jiraId: input.jiraId,

          state: input.state,
          type: input.type,
        },
      })

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
          worklogs: true,
        },
      })

      return stories
    },
  })
  .query("getForTimekeeper", {
    input: z.object({
      projectId: z.string(),
      // TODO(SP): sprintId: z.string()
      startDate: z.date(),
      endDate: z.date(),
    }),
    async resolve({ ctx, input }) {
      console.log(input)
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
            where: {
              date: {
                gte: input.startDate,
                lte: input.endDate,
              },
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
          title: input.title,
          description: input.description,
          estimate: input.estimate,

          projectId: input.projectId,
          creatorId: input.creatorId,
          assigneeId: input.assigneeId,
          sprintId: input.sprintId,

          githubId: input.githubId,
          jiraId: input.jiraId,

          state: input.state,
          type: input.type,
        },
      })

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
      await prisma.story.delete({
        where: {
          id: input.id,
        },
      })
    },
  })

export type StoryCreateOutput = inferMutationOutput<"story.create">
export type StoryGetAllOutput = inferQueryOutput<"story.getAll">
export type StoryGetByIdOutput = inferQueryOutput<"story.getById">
export type StoryGetForTimekeeperOutput = inferQueryOutput<"story.getForTimekeeper">
export type StoryUpdateOutput = inferMutationOutput<"story.update">
export type StoryDeleteByIdOutput = inferMutationOutput<"story.deleteById">
