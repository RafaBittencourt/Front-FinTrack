export type ContaFormValues = {
  id: number
  isActive: boolean
  name: string
  type: number
  balance: number
  color: string
}

export interface IContasProps {
  totalCount: number
  totalPages: number
  pageNumber: number
  items: ContaFormValues[]
}

export type ContasFilterValues = {
  name?: string
  isActive?: boolean
  maxResultCount: number
  pageNumber: number
}
