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
export type ProjectInput = z.infer<typeof Project>

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
export type SprintInput = z.infer<typeof Sprint>

export const Worklog: Zod.AnyZodObject = z.object({
  id: z.string().nullish(),

  description: z.string(),
  date: z.date(),
  effort: z.number(),
  remainingEffort: z.number(),

  creatorId: z.string().nullish(),
  creator: z.lazy(() => User).nullish(),

  storyId: z.string().nullish(),
  story: z.lazy(() => Story).nullish(),

  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})
export const Worklogs = z.array(Worklog)
export type WorklogInput = z.infer<typeof Worklog>

export const Story: Zod.AnyZodObject = z.object({
  id: z.string().nullish(),

  title: z.string().default("").nullish(),
  description: z.string().nullish(),
  estimate: z.number().nullish(),
  state: z.enum(["NEW", "READY", "IN_PROGRESS", "DELIVERED", "IN_REVIEW", "DONE", "BLOCKED", "DELETED"]).nullish(),
  type: z.enum(["DEVELOPMENT", "DOCUMENTATION", "BUG_FIXING", "MAINTENANCE", "SUPPORT"]).nullish(),

  githubId: z.string().nullish(),
  jiraId: z.string().nullish(),

  projectId: z.string().nullish(),
  project: z.lazy(() => Project).nullish(),

  creatorId: z.string().nullish(),
  creator: z.lazy(() => User).nullish(),

  assigneeId: z.string().nullish(),
  assignee: z.lazy(() => User).nullish(),

  sprintId: z.string().nullish(),
  sprint: z.lazy(() => Sprint).nullish(),

  worklogs: z.array(Worklog).nullish(),
})
export const Stories = z.array(Story)
export type StoryInput = z.infer<typeof Story>

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
export type UserInput = z.infer<typeof User>

export const SprintStateBreakdown: Zod.AnyZodObject = z.object({
  day: z.string(),

  inProgress: z.number().nullish(),
  new: z.number().nullish(),
  ready: z.number().nullish(),
  delivered: z.number().nullish(),
  inReview: z.number().nullish(),
  done: z.number().nullish(),
  blocked: z.number().nullish(),
  deleted: z.number().nullish(),
})
export type SprintStateBreakdownOutput = z.infer<typeof SprintStateBreakdown>

export const SprintActionLog: Zod.AnyZodObject = z.object({
  authorId: z.string().nullish(),
  sprintId: z.string().nullish(),
  storyId: z.string().nullish(),

  description: z.enum(["STORY_CREATED", "STORY_ASSIGNEE_CHANGED", "STORY_STATE_CHANGED", "STORY_DELETED"]),

  createdAt: z.date().nullish(),
})
export type SprintActionLogReg = z.infer<typeof SprintActionLog>
