export type ConfiguracoesFormValues = {
  id?: number
  nome: string
  displayName: string
  descricao: string
  isDefault: boolean
  criadoEm: string
}
export interface IConfiguracoesProps {
  totalCount: number
  totalPages: number
  pageNumber: number
  items: ConfiguracoesFormValues
}

export type ConfiguracoesFilterValues = {
  descricao: string
  isActive: string
  maxResultCount: number
  pageNumber: number
}
