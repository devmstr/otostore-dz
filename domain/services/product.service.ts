import type { ProductRepository } from '../repositories/product.repository'
import { type ProductDto, ProductSchema } from '../dto/product.dto'
import type { PriceRange } from '@/lib/constants/product'

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async getProducts(query?: {
    search?: string
    category?: string
    availability?: string
    priceRange?: string
    page?: number
    pageSize?: number
  }) {
    return this.repository.findMany(query)
  }

  async getProduct(id: bigint) {
    const product = await this.repository.findById(id)
    if (!product) throw new Error('Product not found')
    return product
  }

  async createProduct(input: ProductDto) {
    const validated = ProductSchema.parse(input)
    return this.repository.create(validated)
  }

  async updateProduct(id: bigint, input: Partial<ProductDto>) {
    const validated = ProductSchema.partial().parse(input)
    return this.repository.update(id, validated)
  }

  async deleteProduct(id: bigint) {
    await this.repository.delete(id)
    return { message: 'Product deleted successfully' }
  }
}
