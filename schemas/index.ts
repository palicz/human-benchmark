import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Hibás email cím!"
    }),
    password: z.string().min(1, {
        message: "Hibás jelszó!"
    })
});