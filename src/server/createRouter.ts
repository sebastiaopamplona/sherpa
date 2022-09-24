import { FgRed, FgWhite, FgYellow } from "../utils/aux"

import { TRPCError } from "@trpc/server"
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
    console.log("path: ", path)
    console.log("ctx.session: ", ctx.session)

    // FIXME: When there's a refresh in the browser, the first time this
    // request is hit the ctx is null resulting in the TRPCError bellow.
    // The second time, the ctx is not null and it works fine.
    // Figure out why the ctx is null at first and bring this check back.

    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const start = Date.now()
    const result = await next()
    const durationMs = Date.now() - start

    let logColor: string = FgWhite
    if (durationMs > 200 && durationMs < 300) {
      logColor = FgYellow
    } else if (durationMs > 300) {
      logColor = FgRed
    }

    console.log(
      `${logColor}{"path": "${path}", "type": "${type}", "duration": "${durationMs}ms", "ok": "${result.ok}"}\x1b[0m`
    )

    return result
  })
  .merge("project.", projectRouter)
  .merge("story.", storyRouter)
  .merge("worklog.", worklogRouter)
  .merge("user.", userRouter)
  .merge("sprint.", sprintRouter)
  .merge("auth.", authRouter)

// export type definition of API
export type AppRouter = typeof appRouter
