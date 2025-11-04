// 'use server'

// import 'server-only'
// import { container } from '@/domain/di/container'
// import { getCurrentUser } from '@/lib/auth'
// import { revalidatePath } from 'next/cache'

// export async function createPOSOrder(data: {
//   customerId?: string
//   items: Array<{ productId: string; quantity: number; price: number }>
//   paymentMethod: 'CASH' | 'CARD' | 'MOBILE'
//   amountPaid: number
//   zakatOptIn?: boolean
// }) {
//   try {
//     const orderService = container.orderService
//     const zakatService = container.zakatService

//     const subtotal = data.items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     )
//     // convert subtotal to cents (assumes price in whole currency units)
//     // NOTE: your code uses floats for many totals; ensure consistent units.
//     const subtotalCents = Math.round(subtotal * 100)

//     let zakatCents = 0
//     if (data.zakatOptIn) {
//       zakatCents = await zakatService.computeZakatCentsFor(subtotalCents)
//     }

//     const total = subtotal + zakatCents / 100

//     // get the user
//     const currentUser = await getCurrentUser()

//     if (!currentUser) throw new Error('You Are not Logged In !')

//     const order = await orderService.createOrder(
//       {
//         customerId: data.customerId,
//         items: data.items,
//         total,
//         paymentMethod: data.paymentMethod,
//         amountPaid: data.amountPaid,
//         status: 'COMPLETED',
//         paymentStatus: data.amountPaid >= total ? 'PAID' : 'PARTIAL'
//       },
//       currentUser.id
//     )

//     // if zakat charged, record transaction linking to order.id (order is created above)
//     if (zakatCents > 0) {
//       try {
//         await zakatService.recordTransaction({
//           userId: undefined,
//           orderId: Number(order.id),
//           baseAmountCents: subtotalCents,
//           note: `Zakat collected for order ${order.id}`
//         })
//       } catch (err) {
//         // do not fail the order if recording zakat fails; but log
//         console.error('Failed to record zakat tx:', err)
//       }
//     }

//     revalidatePath('/dashboard/pos')
//     revalidatePath('/dashboard/orders')
//     return { success: true, data: order }
//   } catch (error) {
//     console.error('[v0] POS order creation error:', error)
//     return { success: false, error: 'Failed to create order' }
//   }
// }
