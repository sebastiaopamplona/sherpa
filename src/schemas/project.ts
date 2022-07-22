import { z } from "zod"

export const projectInputSchema = z.object({
  id: z.string().nullish(),

  name: z.string(),
  description: z.string(),

  githubUrl: z.string().nullish(),
  jiraUrl: z.string().nullish(),

  creatorId: z.string(),
})

// Uncomment for usage in useForm() react hook
export type CreateProjectInput = z.TypeOf<typeof projectInputSchema>
