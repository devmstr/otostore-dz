"use client"

import { useQuery } from "@tanstack/react-query"
import { getAuditLogs } from "../_actions/audit-logs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Input } from "@/components/ui/input"

const actionColors: Record<string, string> = {
  CREATE_ORDER: "bg-green-500/10 text-green-500",
  UPDATE_ORDER_STATUS: "bg-blue-500/10 text-blue-500",
  CANCEL_ORDER: "bg-red-500/10 text-red-500",
  CREATE_CUSTOMER: "bg-purple-500/10 text-purple-500",
  UPDATE_CUSTOMER: "bg-blue-500/10 text-blue-500",
  DELETE_CUSTOMER: "bg-red-500/10 text-red-500",
  ADJUST_STOCK: "bg-yellow-500/10 text-yellow-500",
  UPDATE_USER_ROLE: "bg-orange-500/10 text-orange-500",
}

export function AuditLogsTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data } = useQuery({
    queryKey: ["audit-logs", { page, search }],
    queryFn: () => getAuditLogs({ page, pageSize: 50, search }),
  })

  const logs = data?.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by user or action..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log: any) => (
              <TableRow key={log.id.toString()}>
                <TableCell className="font-medium">
                  {log.user.firstName} {log.user.lastName}
                </TableCell>
                <TableCell>
                  <Badge className={actionColors[log.action] || "bg-gray-500/10 text-gray-500"}>{log.action}</Badge>
                </TableCell>
                <TableCell>{log.entity}</TableCell>
                <TableCell className="max-w-xs truncate text-sm">
                  {log.details ? JSON.stringify(log.details) : "—"}
                </TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
