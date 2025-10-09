'use client'
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type ProductDto } from '@/domain/dto/product.dto'

type ProductDialogType = 'create' | 'update' | 'delete' | 'import'

type ProductDialogsContextType = {
  open: ProductDialogType | null
  setOpen: (str: ProductDialogType | null) => void
  currentRow: ProductDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ProductDto | null>>
}

const ProductDialogsContext =
  React.createContext<ProductDialogsContextType | null>(null)

export function ProductDialogsProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<ProductDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProductDto | null>(null)

  return (
    <ProductDialogsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProductDialogsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProductDialogs = () => {
  const productDialogsContext = React.useContext(ProductDialogsContext)

  if (!productDialogsContext) {
    throw new Error(
      'userProductDialogs has to be used within <ProductDialogsContext>'
    )
  }

  return productDialogsContext
}
