import type { Container } from "../@types"
import { prisma } from "../database/db-service"
import { ProductRepository } from "../repositories/product.repository"
import { ProductService } from "../services/product.service"
import { OrderRepository } from "../repositories/order.repository"
import { OrderService } from "../services/order.service"
import { InventoryRepository } from "../repositories/inventory.repository"
import { InventoryService } from "../services/inventory.service"
import { CustomerRepository } from "../repositories/customer.repository"
import { CustomerService } from "../services/customer.service"
import { SupplierRepository } from "../repositories/supplier.repository"
import { SupplierService } from "../services/supplier.service"
import { DebtRepository } from "../repositories/debt.repository"
import { DebtService } from "../services/debt.service"

/**
 * A simple, type-safe DI container
 * Explicit registration ensures full type safety and clarity.
 */
class DIContainer implements Container {
  productRepository: ProductRepository
  productService: ProductService
  orderRepository: OrderRepository
  orderService: OrderService
  inventoryRepository: InventoryRepository
  inventoryService: InventoryService
  customerRepository: CustomerRepository
  customerService: CustomerService
  supplierRepository: SupplierRepository
  supplierService: SupplierService
  debtRepository: DebtRepository
  debtService: DebtService

  constructor() {
    // Instantiate and wire dependencies manually
    this.productRepository = new ProductRepository(prisma)
    this.productService = new ProductService(this.productRepository)

    this.orderRepository = new OrderRepository(prisma)
    this.orderService = new OrderService(this.orderRepository)

    this.inventoryRepository = new InventoryRepository(prisma)
    this.inventoryService = new InventoryService(this.inventoryRepository)

    this.customerRepository = new CustomerRepository(prisma)
    this.customerService = new CustomerService(this.customerRepository)

    this.supplierRepository = new SupplierRepository(prisma)
    this.supplierService = new SupplierService(this.supplierRepository)

    this.debtRepository = new DebtRepository(prisma)
    this.debtService = new DebtService(this.debtRepository)
  }
}

// Singleton instance
export const container = new DIContainer()
