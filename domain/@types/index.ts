import { ProductRepository } from '../repositories/product.repository'
import { ProductService } from '../services/product.service'

export interface Container {
  productRepository: ProductRepository
  productService: ProductService
}
