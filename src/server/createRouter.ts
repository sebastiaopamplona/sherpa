import { TRPCError } from "@trpc/server"
import { authRouter } from "./router/auth"
import { createRouter } from "./context"
import { exampleRouter } from "./router/example"
import { storyRouter } from "./router/story"
import superjson from "superjson"
// src/server/router/index.ts

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return next()
  })
  .merge("story.", storyRouter)
  .merge("example.", exampleRouter)
  .merge("auth.", authRouter)

// export type definition of API
export type AppRouter = typeof appRouter
