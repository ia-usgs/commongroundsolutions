// Zod schema for the public signup form. Mirrors the DB CHECK constraints in the RLS policy.
import { z } from "zod";

export const signupFormSchema = z.object({
  first_name: z.string().trim().min(1, "First name required").max(100),
  last_name: z.string().trim().min(1, "Last name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone required").max(30),
  payment_method: z.enum(["zelle", "venmo"]),
  notes: z.string().max(500).optional(),
});

export type ValidatedSignup = z.infer<typeof signupFormSchema>;
