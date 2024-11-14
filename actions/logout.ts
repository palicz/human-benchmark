"use server";

import { signOut } from "@/auth";

export const logout = async () => {
    try {
        await signOut({
            redirectTo: "/auth/login"
        });
    } catch (error) {
        throw error;
    }
}