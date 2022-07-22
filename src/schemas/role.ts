import { z } from "zod"

export const roleInputSchema = z.object({
  id: z.string().nullish(),

  name: z.string(),
})

// Uncomment for usage in useForm() react hook
// export type GetRoleInput = z.TypeOf<typeof roleInputSchema>
