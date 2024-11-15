"use server";

import { db } from "@/lib/db";

export const getAllUsers = async () => {
    try {
        const users = await db.user.findMany();
        return users;
    } catch (error) {
        return null;
    }
};