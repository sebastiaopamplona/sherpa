import { z } from "zod"

export const worklogInputSchema = z.object({
  id: z.string().nullish(),

  description: z.string(),
  duration: z.number(),

  creatorId: z.string(),
  storyId: z.string(),
})

// Uncomment for usage in useForm() react hook
// export type GetWorklogInput = z.TypeOf<typeof worklogInputSchema>
