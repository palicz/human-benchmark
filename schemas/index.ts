import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Hibás email cím!"
    }),
    password: z.string().min(1, {
        message: "Hibás jelszó!"
    })
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Hibás email cím!"
    }),
    password: z.string().min(6, {
        message: "A jelszónak legalább 6 karakterből kell állnia!"
    }),
    name: z.string().min(1, {
        message: "Hibás felhasználónév!"
    })
});