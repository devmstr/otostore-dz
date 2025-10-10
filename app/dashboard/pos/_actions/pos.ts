'use server'

import { container } from '@/domain/di/container'
import { useQuery } from '@tanstack/react-query'
import { result } from 'lodash'
import { revalidatePath } from 'next/cache'
import { getAllPosProductQueryOption } from '../_queries/queries'
import { auth } from '@clerk/nextjs/server'

export async function searchProducts(query: string) {
  try {
    const productService = container.productService
    const result = await productService.getProducts({
      page: 1,
      pageSize: 10,
      stock: 1,
      search: query
    })
    return { success: true, data: result.data }
  } catch (error) {
    return { success: false, error: 'Failed to search products' }
  }
}

export async function getCustomers() {
  try {
    const customerService = container.customerService
    const result = await customerService.getCustomers({
      page: 1,
      pageSize: 10
    })
    return { success: true, data: result.data }
  } catch (error) {
    return { success: false, error: 'Failed to fetch customers' }
  }
}

export async function createPOSOrder(data: {
  customerId?: string
  items: Array<{
    productId: bigint
    quantity: number
    price: number
    discount: number
  }>
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE'
  amountPaid: number
}) {
  try {
    const { userId } = await auth()
    if (!userId)
      return { success: false, error: 'Failed to create order (UNAUTHORIZED)' }

    const orderService = container.orderService

    const total = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const order = await orderService.createOrder(
      {
        customerId: data.customerId,
        items: data.items,
        // total,
        paymentMethod: data.paymentMethod
        // amountPaid: data.amountPaid,
        // status: 'COMPLETED',
        // paymentStatus: data.amountPaid >= total ? 'PAID' : 'PARTIAL'
      },
      userId
    )

    revalidatePath('/dashboard/pos')
    revalidatePath('/dashboard/orders')

    return { success: true, data: order }
  } catch (error) {
    console.error('[v0] POS order creation error:', error)
    return { success: false, error: 'Failed to create order' }
  }
}
