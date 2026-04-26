export interface FuncaoPermissaoDto {
  nome: string
  permitido: boolean
  permissionName: string
  descricao: string
}

export interface FuncaoGrupoPermissaoDto {
  nome: string
  descricao: string | null
  permissoes: FuncaoPermissaoDto[]
}

export interface FuncaoCategoriaDto {
  nome: string
  icone: string
  ordem: number
  grupos: FuncaoGrupoPermissaoDto[]
}

export type FuncoesFormValues = {
  id?: number
  nome: string
  displayName: string
  descricao: string
  isDefault: boolean
  criadoEm: string
  categorias: FuncaoCategoriaDto[]
}

export type FuncoesResponseDto = {
  items: FuncoesFormValues
}
export interface IFuncoesProps {
  totalCount: number
  totalPages: number
  pageNumber: number
  items: FuncoesFormValues[]
}

export type FuncoesFilterValues = {
  descricao: string
  isActive: string
  maxResultCount: number
  pageNumber: number
}
