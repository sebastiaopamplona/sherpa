import { authRouter } from "./auth"
import { projectRouter } from "./project"
import { router } from "../trpc"
import { sprintRouter } from "./sprint"
import { storyRouter } from "./story"
import { userRouter } from "./user"
import { worklogRouter } from "./worklog"

export const appRouter = router({
  auth: authRouter,
  project: projectRouter,
  sprint: sprintRouter,
  story: storyRouter,
  user: userRouter,
  worklog: worklogRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
