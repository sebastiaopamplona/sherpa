import { createRouter } from "../context"
import { prisma } from "../db/client"
import { projectInputSchema } from "../../schemas/project"
import { z } from "zod"

export const projectRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: projectInputSchema,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const project = await prisma.project.create({
        data: {
          name: input.name,
          description: input.description,

          githubUrl: input.githubUrl,
          jiraUrl: input.jiraUrl,

          creatorId: input.creatorId,
        },
      })

      return {
        id: project.id,
      }
    },
  })

  // READ
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
        },
      })

      return {
        ...project,
      }
    },
  })
  .query("getAll", {
    async resolve({ ctx, input }) {
      // TODO(SP): implement paging + filtering

      const projects = await prisma.project.findMany()

      return {
        ...projects,
      }
    },
  })

  // UPDATE
  .mutation("update", {
    input: projectInputSchema,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const project = await prisma.project.update({
        where: {
          id: input.id as string,
        },
        data: {
          name: input.name,
          description: input.description,

          githubUrl: input.githubUrl,
          jiraUrl: input.jiraUrl,
        },
      })

      return {
        id: project.id,
      }
    },
  })

  // DELETE
  .mutation("deleteById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await prisma.project.delete({
        where: {
          id: input.id,
        },
      })
    },
  })