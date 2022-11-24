import { Project, Projects } from "../schemas/schemas"
import { inferMutationInput, inferMutationOutput, inferQueryInput, inferQueryOutput } from "../../pages/_app"

import { TRPCError } from "@trpc/server"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"
import { addBusinessDays, addDays, differenceInCalendarDays, differenceInDays, isSameDay } from "date-fns"
import { UserProjectCapacity } from "@prisma/client"

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

  .query("getUserCapacity", {
    input: z.object({
      userId: z.string(),
      projectId: z.string(),
      startDate: z.date(),
      endDate: z.date(),
    }),
    output: z
      .object({
        date: z.date(),
        capacity: z.number(),
      })
      .array(),
    async resolve({ ctx, input }) {
      let capacities = await prisma.userProjectCapacity.findMany({
        where: {
          projectId: input.projectId,
          userId: input.userId,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        orderBy: {
          date: "asc",
        },
      })

      let res: Array<{ date: Date; capacity: number }> = []
      const nDays = differenceInCalendarDays(input.endDate, input.startDate) + 1
      for (let i = 0; i < nDays; i++) {
        let cap: number = 0
        let day: Date = addBusinessDays(input.startDate, i)

        if (capacities.length > 0) {
          const peek = capacities[0]!
          if (isSameDay(peek.date, day)) {
            capacities = capacities.slice(1)
            cap = peek.capacity
          }
        }

        res.push({
          date: day,
          capacity: cap,
        })
      }

      return res
    },
  })

  // UPDATE user capacity
  .mutation("setUserCapacity", {
    input: z.object({
      userId: z.string(),
      projectId: z.string(),
      date: z.date(),
      capacity: z.number().gte(0).lte(24),
    }),
    output: z.object({
      projectId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const m = await prisma.userProjectCapacity.upsert({
        where: {
          userId_projectId_date: {
            userId: input.userId,
            projectId: input.projectId,
            date: input.date,
          },
        },
        update: {
          capacity: input.capacity,
        },
        create: {
          userId: input.userId,
          projectId: input.projectId,
          date: input.date,
          capacity: input.capacity,
        },
      })

      if (!m) {
        throw new TRPCError({ code: "NOT_FOUND", message: `Capacity not found!` })
      }

      return {
        projectId: m.projectId!,
      }
    },
  })

export type ProjectGetUserCapacityOutput = inferQueryOutput<"project.getUserCapacity">
export type ProjectSetUserCapacityInput = inferMutationInput<"project.setUserCapacity">
export type ProjectGetByUserIdOutput = inferQueryOutput<"project.getByUserId">
