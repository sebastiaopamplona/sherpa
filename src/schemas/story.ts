import { z } from "zod"

export const storyInputSchema = z.object({
  id: z.string().nullish(),

  title: z.string(),
  description: z.string(),
  estimate: z.number(),

  githubId: z.string().nullish(),
  jiraId: z.string().nullish(),

  projectId: z.string(),
  // project: z.nullish(),

  creatorId: z.string(),
  // creator: z.nullish(),

  assigneeId: z.string().nullish(),
  // assignee: z.nullish(),

  sprintId: z.string().nullish(),
  // sprint: z.nullish(),

  // worklogs: z.nullish(),

  state: z.enum([
    "NEW",
    "READY",
    "IN_PROGRESS",
    "DELIVERED",
    "IN_REVIEW",
    "DONE",
    "DELETED",
  ]),
  type: z.enum([
    "DEVELOPMENT",
    "DOCUMENTATION",
    "BUG_FIXING",
    "MAINTENANCE",
    "SUPPORT",
  ]),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

// Uncomment for usage in useForm() react hook
// export type GetStoryInput = z.TypeOf<typeof storyInputSchema>
