"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createDebtAction } from "../_actions/debts"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import type { DebtDto } from "@/domain/dto/debt.dto"

interface DebtMutateDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debt: DebtDto | null
}

export function DebtMutateDrawer({ open, onOpenChange, debt }: DebtMutateDrawerProps) {
  const queryClient = useQueryClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      await createDebtAction(formData)
      toast.success("Debt/Loan created successfully")
      queryClient.invalidateQueries({ queryKey: ["debts"] })
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to create debt/loan")
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Debt/Loan</DrawerTitle>
          <DrawerDescription>Record a new debt or loan for a customer or supplier</DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="px-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Customer Debt</SelectItem>
                  <SelectItem value="SUPPLIER">Supplier Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityId">Entity ID</Label>
              <Input id="entityId" name="entityId" placeholder="Customer or Supplier ID" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityName">Entity Name</Label>
              <Input id="entityName" name="entityName" placeholder="Name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Optional description" />
            </div>
          </div>

          <DrawerFooter>
            <Button type="submit">Create</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
