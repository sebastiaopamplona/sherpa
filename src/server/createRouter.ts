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
    // FIXME(SP): When there's a refresh in the browser, the first time this
    // request is hit the ctx is null resulting in the TRPCError bellow.
    // The second time, the ctx is not null and it works fine.
    // Figure out why the ctx is null at first and bring this check back.

    // if (!ctx.session) {
    //   throw new TRPCError({ code: "UNAUTHORIZED" })
    // }

    return next()
  })
  .merge("project.", projectRouter)
  .merge("story.", storyRouter)
  .merge("worklog.", worklogRouter)
  .merge("auth.", authRouter)

// export type definition of API
export type AppRouter = typeof appRouter
