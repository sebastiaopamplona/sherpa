import { inferMutationOutput, inferQueryOutput } from "../../pages/_app"

import { TRPCError } from "@trpc/server"
import { User } from "../schemas/schemas"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"
import { NoSprint, NoUser } from "../data/data"

export const userRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: User,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (input.name === NoUser.name) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `The name '${NoUser.name}' is reserved.` })
      }

      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

  // READ
  .query("getAll", {
    async resolve({ ctx, input }) {
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
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
        name: z.string(),
        image: z.string(),
      })
    ),
    async resolve({ ctx, input }) {
      const users = await prisma.user.findMany({
        where: {
          roleInProjects: {
            some: {
              projectId: input.projectId,
            },
          },
        },
      })

      return users
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

export type UserCreateOutput = inferMutationOutput<"user.create">
export type UserGetAllOutput = inferQueryOutput<"user.getAll">
export type UserGetByIdOutput = inferQueryOutput<"user.getById">
export type UserGetByProjectIdOutput = inferQueryOutput<"user.getByProjectId">
export type UserUpdateOutput = inferMutationOutput<"user.update">
export type UserDeleteByIdOutput = inferMutationOutput<"user.deleteById">
