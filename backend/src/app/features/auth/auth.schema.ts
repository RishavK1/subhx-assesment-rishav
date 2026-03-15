import { z } from 'zod';

export const registerRequestSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
});

export const loginRequestSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72)
});

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const authSessionResponseSchema = z.object({
  success: z.literal(true),
  accessToken: z.string(),
  user: authUserSchema
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
