import type React from "react"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-muted/50 min-h-screen">{children}</div>
}
