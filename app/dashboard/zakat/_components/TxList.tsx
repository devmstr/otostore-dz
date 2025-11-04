// app/dashboard/zakat/components/TxList.tsx
'use client'
import React from 'react'

export default function TxList({ initialTxs }: { initialTxs?: any[] }) {
  return (
    <div className="mt-4">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th>Date</th>
            <th>Order</th>
            <th>User</th>
            <th>Base</th>
            <th>Zakat</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {initialTxs?.map((t: any) => (
            <tr key={String(t.id)}>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
              <td>{t.orderId ?? '-'}</td>
              <td>{t.userId ?? '-'}</td>
              <td>{(t.baseAmountCents / 100).toFixed(2)}</td>
              <td>{(t.amountCents / 100).toFixed(2)}</td>
              <td>{t.note ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
