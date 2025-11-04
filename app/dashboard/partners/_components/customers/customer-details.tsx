'use client'

import { useQuery } from '@tanstack/react-query'
import { getCustomerAction } from '../../_actions/customers/customers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Award, ShoppingBag } from 'lucide-react'

export function CustomerDetails({ customerId }: { customerId: bigint }) {
  const { data: customer } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomerAction(customerId)
  })

  if (!customer) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
        <p className="text-muted-foreground mt-1">Customer Profile</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.email && (
              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span>{customer.email}</span>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground h-4 w-4" />
                <span>
                  {customer.address}
                  {customer.city && `, ${customer.city}`}
                  {customer.postalCode && ` ${customer.postalCode}`}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-muted-foreground h-4 w-4" />
                <span>Total Orders</span>
              </div>
              <span className="font-semibold">{customer._count.orders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Spent</span>
              <span className="text-lg font-bold">
                ${Number(customer.totalSpent).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="text-muted-foreground h-4 w-4" />
                <span>Loyalty Points</span>
              </div>
              <Badge className="bg-purple-500/10 text-purple-500">
                {customer.loyaltyPoints}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customer.orders.map((order: any) => (
                <TableRow key={order.id.toString()}>
                  <TableCell className="font-mono text-sm">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell className="font-semibold">
                    ${Number(order.total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
