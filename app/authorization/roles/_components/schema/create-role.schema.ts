import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'role name is required')
    .max(90, 'role name is do long'),

 description: z
    .string()
    .max(500, 'role name is do long')
    .nullish(),
});

export type CreateRoleSchemaType = z.infer<typeof createRoleSchema>;