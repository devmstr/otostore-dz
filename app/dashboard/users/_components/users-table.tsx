"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "../_actions/users"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RoleSelector } from "./role-selector"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const roleColors = {
  ADMIN: "bg-red-500/10 text-red-500",
  MANAGER: "bg-blue-500/10 text-blue-500",
  CASHIER: "bg-green-500/10 text-green-500",
}

export function UsersTable() {
  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  })

  if (!users) return <div>Loading...</div>

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl || undefined} />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge className={roleColors[user.role as keyof typeof roleColors]}>{user.role}</Badge>
              </TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <RoleSelector userId={user.id} currentRole={user.role} onUpdate={() => refetch()} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
