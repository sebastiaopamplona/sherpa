import { Project, Projects } from "../schemas/schemas"
import { inferMutationOutput, inferQueryOutput } from "../../pages/_app"

import { TRPCError } from "@trpc/server"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"

export const projectRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: Project,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const projectCountByName = await prisma.project.count({
        where: {
          name: input.name,
        },
      })
      if (projectCountByName > 0) {
        throw new TRPCError({ code: "CONFLICT", message: `Project with name '${input.name}' aleady exists.` })
      }

      const project = await prisma.project.create({
        data: {
          name: input.name,
          description: input.description,

          githubUrl: input.githubUrl,
          jiraUrl: input.jiraUrl,

          creatorId: input.creatorId,
        },
      })

      const adminRole = await prisma.role.findUnique({
        where: {
          name: "admin",
        },
      })

      await prisma.userRolesInProjects.create({
        data: {
          userId: input.creatorId,
          roleId: adminRole!.id,
          projectId: project!.id,
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
    output: Project,
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
  .query("getByUserId", {
    input: z.object({
      userId: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const userRolesProject = await prisma.userRolesInProjects.findMany({
        where: {
          userId: input.userId as string,
        },
      })

      if (userRolesProject.length === 0) {
        return []
      }

      let projectIds: string[] = []
      userRolesProject.forEach((r) => projectIds.push(r.projectId))

      const projects = await prisma.project.findMany({
        orderBy: {
          name: "asc",
        },
        where: {
          id: {
            in: projectIds,
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          githubUrl: true,
          _count: {
            select: {
              stories: true,
              users: true,
              sprints: true,
            },
          },
        },
      })

      return projects
    },
  })
  .query("getAll", {
    output: Projects,
    async resolve({ ctx, input }) {
      // TODO(SP): implement paging + filtering

      const projects = await prisma.project.findMany()

      return projects
    },
  })

  // UPDATE
  .mutation("update", {
    input: Project,
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

export type ProjectCreateOutput = inferMutationOutput<"project.create">
export type ProjectGetAllOutput = inferQueryOutput<"project.getAll">
export type ProjectGetByIdOutput = inferQueryOutput<"project.getById">
export type ProjectGetByUserIdOutput = inferQueryOutput<"project.getByUserId">
export type ProjectUpdateOutput = inferMutationOutput<"project.update">
export type ProjectDeleteByIdOutput = inferMutationOutput<"project.deleteById">
