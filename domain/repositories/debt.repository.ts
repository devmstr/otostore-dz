import type { DatabaseService } from "../database/db-service"
import type { CreateDebtDto, CreateDebtPaymentDto } from "../dto/debt.dto"

export class DebtRepository {
  constructor(private readonly db: DatabaseService) {}

  async findMany(query?: {
    search?: string
    page?: number
    pageSize?: number
    type?: string
    status?: string
  }) {
    const page = query?.page || 1
    const pageSize = query?.pageSize || 25
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (query?.type) {
      where.type = { in: query.type.split(",") }
    }

    if (query?.status) {
      where.status = { in: query.status.split(",") }
    }

    const [data, total] = await Promise.all([
      this.db.debt.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
          payments: true,
        },
      }),
      this.db.debt.count({ where }),
    ])

    return { data, total, page, pageSize }
  }

  async findById(id: bigint) {
    return this.db.debt.findUnique({
      where: { id },
      include: {
        customer: true,
        supplier: true,
        payments: { orderBy: { createdAt: "desc" } },
      },
    })
  }

  async create(data: CreateDebtDto) {
    const remaining = data.amount
    return this.db.debt.create({
      data: {
        ...data,
        remaining,
        status: "PENDING",
      },
    })
  }

  async update(id: bigint, data: Partial<CreateDebtDto>) {
    return this.db.debt.update({ where: { id }, data })
  }

  async delete(id: bigint) {
    return this.db.debt.delete({ where: { id } })
  }

  async addPayment(data: CreateDebtPaymentDto) {
    return this.db.$transaction(async (tx) => {
      // Create payment
      const payment = await tx.debtPayment.create({ data })

      // Get current debt
      const debt = await tx.debt.findUnique({ where: { id: data.debtId } })
      if (!debt) throw new Error("Debt not found")

      // Calculate new values
      const newPaid = Number(debt.paid) + data.amount
      const newRemaining = Number(debt.amount) - newPaid

      // Determine new status
      let newStatus: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" = "PENDING"
      if (newRemaining <= 0) {
        newStatus = "PAID"
      } else if (newPaid > 0) {
        newStatus = "PARTIAL"
      }

      // Update debt
      await tx.debt.update({
        where: { id: data.debtId },
        data: {
          paid: newPaid,
          remaining: newRemaining,
          status: newStatus,
        },
      })

      return payment
    })
  }

  async getOverdueDebts() {
    return this.db.debt.findMany({
      where: {
        status: { in: ["PENDING", "PARTIAL"] },
        dueDate: { lt: new Date() },
      },
      include: {
        customer: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    })
  }
}
