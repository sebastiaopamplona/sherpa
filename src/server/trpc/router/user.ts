import { protectedProcedure, router } from "../trpc"

import { prisma } from "../../db/client"
import { z } from "zod"

export const userRouter = router({
  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          image: z.string(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
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
    }),
})
// export type UserGetByProjectIdOutput = inferQueryOutput<"user.getByProjectId">
