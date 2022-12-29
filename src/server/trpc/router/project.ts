import { addBusinessDays, differenceInCalendarDays, isSameDay } from "date-fns"
import { protectedProcedure, router } from "../trpc"

import { Project } from "../../schemas/schemas"
import { TRPCError } from "@trpc/server"
import { prisma } from "../../db/client"
import { z } from "zod"

export const projectRouter = router({
  create: protectedProcedure
    .input(Project)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(Project)
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
        },
      })

      return {
        ...project,
      }
    }),
  getByUserId: protectedProcedure.input(z.object({ userId: z.string().nullish() })).query(async ({ ctx, input }) => {
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
  }),
  getAll: protectedProcedure.output(z.array(Project)).query(async ({ ctx }) => {
    // TODO(SP): implement paging + filtering

    const projects = await prisma.project.findMany()

    return projects
  }),
  update: protectedProcedure
    .input(Project)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.update({
        where: {
          id: input.id,
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
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.delete({
        where: {
          id: input.id,
        },
      })

      return {
        id: project.id,
      }
    }),
  getUserCapacity: protectedProcedure
    .input(z.object({ userId: z.string(), projectId: z.string(), startDate: z.date(), endDate: z.date() }))
    .output(z.array(z.object({ date: z.date(), capacity: z.number() })))
    .query(async ({ ctx, input }) => {
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
    }),
  setUserCapacity: protectedProcedure
    .input(z.object({ userId: z.string(), projectId: z.string(), date: z.date(), capacity: z.number().gte(0).lte(24) }))
    .mutation(async ({ ctx, input }) => {
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
    }),
})
