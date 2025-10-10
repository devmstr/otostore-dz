"use client"

import { useQuery } from "@tanstack/react-query"
import { getRevenueChartData } from "../_actions/analytics"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function RevenueChart() {
  const { data } = useQuery({
    queryKey: ["revenue-chart"],
    queryFn: () => getRevenueChartData(),
  })

  if (!data) return null

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
        />
        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
