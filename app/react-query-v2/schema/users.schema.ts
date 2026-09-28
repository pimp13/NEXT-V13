import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, "ایمیل الزامی است")
    .email("ایمیل معتبر نیست"),

  name: z
    .string()
    .optional(),

  isActive: z
    .boolean(),

  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "رمز عبور باید حداقل شامل یک حرف و یک عدد باشد"
    ),

  username: z
    .string()
    .min(1, "نام کاربری الزامی است")
    .max(95, "نام کاربری نمی‌تواند بیشتر از ۹۵ کاراکتر باشد"),

  meta: z
    .record(z.string(), z.unknown())
    .nullable()
    .optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;