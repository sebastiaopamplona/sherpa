import { createRouter } from "../context"
import { z } from "zod"

export const storyRouter = createRouter()
  .mutation("create", {
    input: z.object({
      // TODO
    }),
    output: z.object({
      // TODO
    }),
    resolve({ input }) {
      return {}
    },
  })
  .mutation("deleteById", {
    input: z.object({
      // TODO
    }),
    output: z.object({
      // TODO
    }),
    resolve({ ctx }) {
      return {}
    },
  })
