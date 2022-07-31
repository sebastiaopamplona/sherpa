import { z } from "zod"

export const Project: Zod.AnyZodObject = z.object({
  id: z.string().nullish(),

  name: z.string(),
  description: z.string().nullish(),

  githubUrl: z.string().nullish(),
  jiraUrl: z.string().nullish(),

  creatorId: z.string(),
  creator: z.lazy(() => User).nullish(),

  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})
export const Projects = z.array(Project)
export type ProjectType = z.infer<typeof Project>
export type ProjectsType = z.infer<typeof Projects>

export const Sprint: Zod.AnyZodObject = z.object({
  id: z.string().nullish(),

  title: z.string(),
  description: z.string().nullish(),
  startAt: z.date(),
  endAt: z.date(),

  creatorId: z.string(),
  creator: z.lazy(() => User).nullish(),

  projectId: z.string(),
  project: z.lazy(() => Project).nullish(),

  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),

  // TODO: bring this back once we support the feature
  // deletedAt: z.date().nullish(),
})
export const Sprints = z.array(Sprint)
export type SprintType = z.infer<typeof Sprint>
export type SprintsType = z.infer<typeof Sprints>

export const Worklog: Zod.AnyZodObject = z.object({
  id: z.string().nullish(),

  description: z.string(),
  date: z.date(),
  effort: z.number(),
  remainingEffort: z.number(),

  creatorId: z.string(),
  creator: z.lazy(() => User).nullish(),

  storyId: z.string(),
  story: z.lazy(() => Story).nullish(),

  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})
export const Worklogs = z.array(Worklog)
export type WorklogType = z.infer<typeof Worklog>
export type WorklogsType = z.infer<typeof Worklogs>

export const Story: Zod.AnyZodObject = z.object({
  id: z.string().nullish(),

  title: z.string(),
  description: z.string(),
  estimate: z.number(),
  state: z.enum(["NEW", "READY", "IN_PROGRESS", "DELIVERED", "IN_REVIEW", "DONE", "DELETED"]),
  type: z.enum(["DEVELOPMENT", "DOCUMENTATION", "BUG_FIXING", "MAINTENANCE", "SUPPORT"]),

  githubId: z.string().nullish(),
  jiraId: z.string().nullish(),

  projectId: z.string(),
  project: z.lazy(() => Project).nullish(),

  creatorId: z.string(),
  creator: z.lazy(() => User).nullish(),

  assigneeId: z.string().nullish(),
  assignee: z.lazy(() => User).nullish(),

  sprintId: z.string().nullish(),
  sprint: z.lazy(() => Sprint).nullish(),

  worklogs: z.array(Worklog).nullish(),
})
export const Stories = z.array(Story)
export type StoryType = z.infer<typeof Story>
export type StoriesType = z.infer<typeof Stories>

export const User: Zod.AnyZodObject = z.object({
  id: z.string().nullish(),

  name: z.string(),
  email: z.string(),
  image: z.string(),

  githubId: z.string().nullish(),
  jiraId: z.string().nullish(),

  createdSprints: z.array(Sprint).nullish(),
  createdStories: z.array(Story).nullish(),
  assignedStories: z.array(Story).nullish(),
  createdProjects: z.array(Project).nullish(),
  worklogs: z.array(Worklog).nullish(),

  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})
export const Users = z.array(User)
export type UserType = z.infer<typeof User>
export type UsersType = z.infer<typeof Users>
