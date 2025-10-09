import { promises as fs } from 'fs'
import path from 'path'
import { Metadata } from 'next'
import Image from 'next/image'
import { z } from 'zod'

import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { Product } from './_seed/schema'
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
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
        <Suspense fallback={<p>Loading...</p>}>
          <DataTable columns={columns} />
        </Suspense>
        <ProductsDialogs />
      </div>
    </ProductDialogsProvider>
  )
}
