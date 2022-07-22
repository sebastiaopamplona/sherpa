import { z } from "zod"

export const sprintInputSchema = z.object({
  id: z.string().nullish(),

  title: z.string(),
  description: z.string(),
  startAt: z.date(),
  endAt: z.date(),

  creatorId: z.string(),
  projectId: z.string(),
})

// Uncomment for usage in useForm() react hook
// export type GetSprintInput = z.TypeOf<typeof sprintInputSchema>
