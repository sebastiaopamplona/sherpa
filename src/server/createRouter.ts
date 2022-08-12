import { authRouter } from "./router/auth"
import { createRouter } from "./context"
import { projectRouter } from "./router/project"
import { sprintRouter } from "./router/sprint"
import { storyRouter } from "./router/story"
import superjson from "superjson"
import { userRouter } from "./router/user"
import { worklogRouter } from "./router/worklog"

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(async ({ ctx, next, path, type }) => {
    const start = Date.now()
    const result = await next()
    const durationMs = Date.now() - start
    result.ok
      ? console.log("OK request timing:", { path, type, durationMs })
      : console.log("Non-OK request timing:", { path, type, durationMs })

    // FIXME: When there's a refresh in the browser, the first time this
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
  .merge("user.", userRouter)
  .merge("sprint.", sprintRouter)
  .merge("auth.", authRouter)

// export type definition of API
export type AppRouter = typeof appRouter
