import { TRPCError } from "@trpc/server"
import { User } from "../schemas/schemas"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"

export const userRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: User,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

  // READ
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
  .query("getByProjectName", {
    input: z.object({
      projectName: z.string(),
    }),
    output: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
      })
    ),
    async resolve({ ctx, input }) {
      const project = await prisma.project.findUnique({
        where: {
          name: input.projectName,
        },
      })

      const users = prisma.user.findMany({
        // select: {
        //   email: true,
        // },
        include: {
          roleInProjects: {
            where: {
              projectId: project!.id,
            },
          },
        },
      })

      return users
    },
  })
  .query("getByProjectId", {
    input: z.object({
      projectId: z.string(),
    }),
    // output: Users,
    async resolve({ ctx, input }) {
      const users = prisma.user.findMany({
        include: {
          roleInProjects: {
            where: {
              projectId: input.projectId,
            },
          },
        },
      })

      return users
    },
  })
  .query("getAll", {
    async resolve({ ctx, input }) {
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

  // UPDATE
  .mutation("update", {
    input: User,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

  // DELETE
  .mutation("deleteById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
