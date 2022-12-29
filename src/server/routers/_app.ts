import { router } from "../trpc"
import { userRouter } from "./user"
import { sprintRouter } from "./sprint"
import { storyRouter } from "./story"
import { projectRouter } from "./project"
import { worklogRouter } from "./worklog"
import { authRouter } from "./auth"

const appRouter = t.router({})

export type AppRouter = typeof appRouter
