import * as z from "zod";

export const SettingsSchema = z.object({
    name: z.optional(z.string())
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long!"
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Invalid email address!"
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Invalid email address!"
    }),
    password: z.string().min(1, {
        message: "Invalid password!"
    })
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Invalid email address!"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long!"
    }),
    name: z.string().min(1, {
        message: "Invalid username!"
    })
});