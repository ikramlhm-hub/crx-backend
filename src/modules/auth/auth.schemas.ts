import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['CONSUMER', 'BRAND']).default('CONSUMER')
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>