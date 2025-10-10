"use server"

import { requireRole, createAuditLog } from "@/lib/auth"
import { prisma } from "@/domain/database/db-service"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, role: "ADMIN" | "MANAGER" | "CASHIER") {
  // Only admins can update roles
  await requireRole(["ADMIN"])

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  await createAuditLog("UPDATE_USER_ROLE", "User", userId, { newRole: role })
  revalidatePath("/dashboard/users")

  return user
}

export async function getAllUsers() {
  await requireRole(["ADMIN", "MANAGER"])

  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })
}
