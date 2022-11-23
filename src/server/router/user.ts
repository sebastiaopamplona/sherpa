import { inferMutationOutput, inferQueryOutput } from "../../pages/_app"

import { TRPCError } from "@trpc/server"
import { User } from "../schemas/schemas"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"
import { NoSprint, NoUser } from "../data/data"

export const userRouter = createRouter().query("getByProjectId", {
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

export type UserGetByProjectIdOutput = inferQueryOutput<"user.getByProjectId">
