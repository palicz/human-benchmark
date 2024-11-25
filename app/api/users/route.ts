import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const role = await currentRole();
    console.log("Current user role:", role);

    if (role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await db.user.findMany({
      orderBy: {
        emailVerified: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 