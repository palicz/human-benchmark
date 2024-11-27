import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role: newRole } = await req.json();

    if (!newRole || (newRole !== UserRole.ADMIN && newRole !== UserRole.USER)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const user = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        role: newRole,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_ROLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 