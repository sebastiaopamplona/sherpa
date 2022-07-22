import { z } from "zod"

export const permissionInputSchema = z.object({
  id: z.string().nullish(),

  name: z.string(),
})

// Uncomment for usage in useForm() react hook
// export type GetPermissionInput = z.TypeOf<typeof permissionInputSchema>
