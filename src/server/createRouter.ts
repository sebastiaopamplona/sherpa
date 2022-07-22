import { TRPCError } from "@trpc/server"
import { authRouter } from "./router/auth"
import { createRouter } from "./context"
import { projectRouter } from "./router/project"
import { storyRouter } from "./router/story"
import superjson from "superjson"
import { worklogRouter } from "./router/worklog"
// src/server/router/index.ts

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return next()
  })
  .merge("project.", projectRouter)
  .merge("story.", storyRouter)
  .merge("worklog.", worklogRouter)
  .merge("auth.", authRouter)

// export type definition of API
export type AppRouter = typeof appRouter
