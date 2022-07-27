import { Sprint } from "../schemas/schemas"
import { TRPCError } from "@trpc/server"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"

export const sprintRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: Sprint,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

  // READ
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
  .query("getByProjectId", {
    input: z.object({
      projectId: z.string(),
    }),
    output: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    ),
    async resolve({ ctx, input }) {
      const sprints = prisma.sprint.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          projectId: input.projectId,
        },
      })

      return sprints
    },
  })
  .query("getAll", {
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

  // UPDATE
  .mutation("update", {
    input: Sprint,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

  // DELETE
  .mutation("deleteById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
