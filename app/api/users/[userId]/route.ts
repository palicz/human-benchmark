import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.delete({
      where: {
        id: params.userId,
      },
    });

    return new NextResponse("Successful delete", { status: 200 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 