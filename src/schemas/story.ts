import { z } from "zod"

export const storyInputSchema = z.object({
  id: z.string().nullish(),

  title: z.string(),
  description: z.string(),
  estimate: z.number(),

  githubId: z.string().nullish(),
  jiraId: z.string().nullish(),

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

  projectId: z.string(),
  creatorId: z.string(),
  assigneeId: z.string().nullish(),
  sprintId: z.string().nullish(),
})

// Uncomment for usage in useForm() react hook
// export type GetStoryInput = z.TypeOf<typeof storyInputSchema>
