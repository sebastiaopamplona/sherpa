import { inferMutationOutput, inferQueryOutput } from "../../pages/_app"

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
      const sprint = await prisma.sprint.create({
        data: {
          title: input.title,
          startAt: input.startAt,
          endAt: input.endAt,

          projectId: input.projectId,
          creatorId: input.creatorId,
        },
      })

      return {
        id: sprint.id,
      }
    },
  })

  // READ
  .query("getAll", {
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
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
          createdAt: "desc",
        },
        where: {
          projectId: input.projectId,
        },
      })

      return sprints
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

export type SprintCreateOutput = inferMutationOutput<"sprint.create">
export type SprintGetAllOutput = inferQueryOutput<"sprint.getAll">
export type SprintGetByIdOutput = inferQueryOutput<"sprint.getById">
export type SprintGetByProjectIdOutput = inferQueryOutput<"sprint.getByProjectId">
export type SprintUpdateOutput = inferMutationOutput<"sprint.update">
export type SprintDeleteByIdOutput = inferMutationOutput<"sprint.deleteById">
