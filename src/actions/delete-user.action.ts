"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function deleteUserAction({ userId }: { userId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  if (session.user.role !== "ADMIN" || session.user.id === userId) {
    throw new Error("FORBIDDEN");
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
        role: "USER",
      },
    });

    revalidatePath("/admin/dashboard")

    return {error: null}
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "internal server error!" };
  }
}
