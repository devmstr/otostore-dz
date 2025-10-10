import { Suspense } from "react"
import { AuditLogsTable } from "./_components/audit-logs-table"

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground mt-1">Track all system activities and user actions</p>
      </div>

      <Suspense fallback={<div>Loading audit logs...</div>}>
        <AuditLogsTable />
      </Suspense>
    </div>
  )
}
