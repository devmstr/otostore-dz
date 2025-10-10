import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/domain/database/db-service"

export type UserRole = "ADMIN" | "MANAGER" | "CASHIER"

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  // Sync user with database
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      role: "CASHIER", // Default role
    },
  })

  return {
    ...user,
    clerkId: userId,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new Error("Forbidden: Insufficient permissions")
  }
  return user
}

export async function createAuditLog(action: string, entity: string, entityId?: string, details?: Record<string, any>) {
  const user = await getCurrentUser()
  if (!user) return

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action,
      entity,
      entityId,
      details,
    },
  })
}
