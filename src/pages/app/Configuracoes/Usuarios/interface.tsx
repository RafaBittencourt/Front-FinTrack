export interface IUsuarioProps {
  totalCount: number
  totalPages: number
  pageNumber: number
  items: {
    id: number
    nomeCompleto: string
    nomeUsuario: string
    emailAddress: string
    isEmailConfirmed: boolean
    nomeFuncao: string
    isActive: boolean
    criadoEm: string
  }[]
}

export type UsuarioFormValues = {
  id?: number
  profilePictureId?: string
  nomeUsuario: string
  nome: string
  cpfCnpj?: string
  sobrenome?: string
  emailAddress: string
  numeroTelefone?: string
  password?: string
  confirmPassword?: string
  // setRandomPassword: boolean
  isActive: string
  nomeCompleto?: string
  lastLoginTime?: Date | null
  criadoEm: Date
  funcoes: string
  shouldChangePasswordOnNextLogin: boolean
  isTwoFactorEnabled: boolean
  isLockEnabled: boolean | string
  tipoUsuario: string
  cardCode?: string
  empresaId?: string
  grupoUsuarioId?: string
}

export type UsuarioFilterValues = {
  descricao: string
  isActive: string
  maxResultCount: number
  pageNumber: number
}
