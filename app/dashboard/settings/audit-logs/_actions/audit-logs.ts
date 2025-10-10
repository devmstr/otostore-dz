"use server"

import { requireRole } from "@/lib/auth"
import { prisma } from "@/domain/database/db-service"

export async function getAuditLogs(params?: { page?: number; pageSize?: number; search?: string }) {
  await requireRole(["ADMIN", "MANAGER"])

  const { page = 1, pageSize = 50, search } = params ?? {}
  const skip = (page - 1) * pageSize

  const where = {
    ...(search && {
      OR: [
        { action: { contains: search, mode: "insensitive" as const } },
        { entity: { contains: search, mode: "insensitive" as const } },
        {
          user: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          },
        },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    }),
    prisma.auditLog.count({ where }),
  ])

  return { data, total }
}
