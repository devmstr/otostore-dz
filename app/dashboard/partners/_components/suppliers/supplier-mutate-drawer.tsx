'use client'

import type React from 'react'
import { useSupplierDialogs } from './data-table-provider'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState, useTransition } from 'react'
import {
  createSupplierAction,
  updateSupplierAction
} from '../../_actions/suppliers/suppliers'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

export function SupplierMutateDrawer() {
  const { open, setOpen, currentRow } = useSupplierDialogs()
  const isUpdate = open === 'update'
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState({
    name: currentRow?.name || '',
    email: currentRow?.email || '',
    phone: currentRow?.phone || '',
    address: currentRow?.address || '',
    city: currentRow?.city || '',
    postalCode: currentRow?.postalCode || '',
    description: currentRow?.description || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        if (isUpdate && currentRow?.id) {
          await updateSupplierAction(String(currentRow.id), formData)
          toast.success('Supplier updated successfully')
        } else {
          await createSupplierAction(formData)
          toast.success('Supplier created successfully')
        }
        setOpen(null)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'An error occurred'
        )
      }
    })
  }

  return (
    <Sheet
      open={open === 'create' || open === 'update'}
      onOpenChange={() => setOpen(null)}
    >
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {isUpdate ? 'Edit Supplier' : 'Add New Supplier'}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUpdate ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
