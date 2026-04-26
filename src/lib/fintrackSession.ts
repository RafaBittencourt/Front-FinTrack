export type FinTrackUsuarioDto = {
  id: number
  licencaId: number | null
  login: string
  email: string | null
  nomeExibicao: string | null
  /** URL da foto de perfil (ex.: Google). Ausente em caches antigos do `localStorage`. */
  profile?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type FinTrackAuthResponse = {
  accessToken: string
  expiresAtUtc: string
  usuario: FinTrackUsuarioDto
}

const KEY_USUARIO = 'fintrackUsuario'

function pick<T>(o: Record<string, unknown>, camel: string, pascal: string): T | undefined {
  const v = o[camel] ?? o[pascal]
  return v as T | undefined
}

/** Aceita JSON camelCase (padrão ASP.NET) ou PascalCase legado. */
export function parseFinTrackAuthResponse(raw: unknown): FinTrackAuthResponse | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const accessToken = pick<string>(o, 'accessToken', 'AccessToken')
  const expiresRaw = pick<string | Date>(o, 'expiresAtUtc', 'ExpiresAtUtc')
  const usuarioRaw = pick<Record<string, unknown>>(o, 'usuario', 'Usuario')
  if (!accessToken || expiresRaw === undefined || !usuarioRaw) return null

  const expiresAtUtc =
    typeof expiresRaw === 'string'
      ? expiresRaw
      : expiresRaw instanceof Date
        ? expiresRaw.toISOString()
        : String(expiresRaw)

  const lic = pick<number | null>(usuarioRaw, 'licencaId', 'LicencaId')
  const usuario: FinTrackUsuarioDto = {
    id: Number(pick(usuarioRaw, 'id', 'Id')),
    licencaId: lic === undefined ? null : lic,
    login: String(pick(usuarioRaw, 'login', 'Login') ?? ''),
    email: (pick<string | null>(usuarioRaw, 'email', 'Email') as string | null) ?? null,
    nomeExibicao:
      (pick<string | null>(usuarioRaw, 'nomeExibicao', 'NomeExibicao') as string | null) ?? null,
    profile: (pick<string | null>(usuarioRaw, 'profile', 'Profile') as string | null) ?? null,
    isActive: Boolean(pick(usuarioRaw, 'isActive', 'IsActive')),
    createdAt: String(pick(usuarioRaw, 'createdAt', 'CreatedAt') ?? ''),
    updatedAt: String(pick(usuarioRaw, 'updatedAt', 'UpdatedAt') ?? ''),
  }

  if (!Number.isFinite(usuario.id) || !usuario.login) return null

  return { accessToken, expiresAtUtc, usuario }
}

export function persistFinTrackAuth(data: FinTrackAuthResponse) {
  localStorage.setItem('token', data.accessToken)
  localStorage.setItem('expireTime', String(new Date(data.expiresAtUtc).getTime()))
  localStorage.setItem(KEY_USUARIO, JSON.stringify(data.usuario))
  localStorage.setItem('userId', String(data.usuario.id))
}

export function readFinTrackUsuario(): FinTrackUsuarioDto | null {
  const raw = localStorage.getItem(KEY_USUARIO)
  if (!raw) return null
  try {
    return JSON.parse(raw) as FinTrackUsuarioDto
  } catch {
    return null
  }
}

/** Permissões temporárias até a API Gestão expor roles FinTrack (ecrãs antigos usam estes nomes). */
export const FINTRACK_PROVISIONAL_PERMISSIONS: string[] = [
  'Support.Configuracao.Usuario.Criar',
  'Support.Configuracao.Usuario.Atualizar',
  'Support.Configuracao.Funcao.Criar',
  'Support.Configuracao.Funcao.Atualizar',
  'Support.Configuracao.Configuracao',
]
