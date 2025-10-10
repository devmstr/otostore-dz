import { Container } from '../@types'
import { prisma } from '../database/db-service'
import { ProductRepository } from '../repositories/product.repository'
import { ProductService } from '../services/product.service'
// import type { Container } from '../@types'

/**
 * A simple, type-safe DI container
 * Explicit registration ensures full type safety and clarity.
 */
class DIContainer implements Container {
  productRepository: ProductRepository
  productService: ProductService

  constructor() {
    // Instantiate and wire dependencies manually
    this.productRepository = new ProductRepository(prisma)
    this.productService = new ProductService(this.productRepository)
  }
}

// Singleton instance
export const container = new DIContainer()
