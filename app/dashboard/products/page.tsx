import { promises as fs } from 'fs'
import path from 'path'
import { Metadata } from 'next'
import Image from 'next/image'
import { z } from 'zod'

import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { ProductDialogsProvider } from './_components/data-table-provider'
import { ProductsDialogs } from './_components/data-table-dialogs'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.'
}

export default async function TaskPage() {
  return (
    <ProductDialogsProvider>
      <DataTable columns={columns} />
      <ProductsDialogs />
    </ProductDialogsProvider>
  )
}
