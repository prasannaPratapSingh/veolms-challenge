import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z
            .string({ error: "Name is required!" })
            .min(2, "Name must be at least 2 characters")
            .trim(),

        email: z
            .string({ error: "Email is required!" })
            .trim()
            .toLowerCase()
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address format!"),

        password: z
            .string({ error: "Password is required!" })
            .min(7, "Password must be at least 7 characters long!")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)!")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)!")
            .regex(/[0-9]/, "Password must contain at least one digit (0-9)!")
            .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)!"),
    })
});



export const loginSchema = z.object({
    body: z.object({
        email: z
            .string({ error: "Email is required!" })
            .trim()
            .toLowerCase()
            .email("Invalid email address format!"), // Built-in method use kiya

        password: z
            .string({ error: "Password is required!" })
            .min(7, "Password must be at least 7 characters long!")
    })
});

