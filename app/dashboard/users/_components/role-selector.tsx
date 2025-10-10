"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { updateUserRole } from "../_actions/users"
import { toast } from "sonner"

interface RoleSelectorProps {
  userId: string
  currentRole: string
  onUpdate: () => void
}

export function RoleSelector({ userId, currentRole, onUpdate }: RoleSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleRoleChange = async (newRole: "ADMIN" | "MANAGER" | "CASHIER") => {
    if (newRole === currentRole) return

    setIsUpdating(true)
    try {
      await updateUserRole(userId, newRole)
      toast.success("Role updated successfully")
      onUpdate()
    } catch (error) {
      toast.error("Failed to update role")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isUpdating}>
          Change Role
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")}>Admin</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange("MANAGER")}>Manager</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange("CASHIER")}>Cashier</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
