import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  FINTRACK_PROVISIONAL_PERMISSIONS,
  readFinTrackUsuario,
} from '@/lib/fintrackSession'

interface CurrentUserContextType {
  userId: number | null
  setUserId: React.Dispatch<React.SetStateAction<number | null>>
  permissions: string[]
  tipoLicenca: number
  setToken: React.Dispatch<React.SetStateAction<string | null>>
  loading: boolean
  /** Nome de exibição ou login (cabeçalho do utilizador). */
  nomeUsuario: string
  emailUsuario: string | null
  loginUsuario: string
  /** URL da foto de perfil (`FinTrackUsuario.Profile`). */
  profileUrl: string | null
}

interface IContextProps {
  children: ReactNode
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null)

export function useUserData() {
  const context = useContext(CurrentUserContext)
  if (!context) {
    throw new Error('useUserData must be used within a DataProvider')
  }

  const checkPermission = (permissionName: string | string[]) => {
    if (Array.isArray(permissionName)) {
      return permissionName.some((p) =>
        context.permissions.some((perm) => perm === p),
      )
    }
    return context.permissions.some((perm) => perm === permissionName)
  }

  return { ...context, checkPermission }
}

export function DataProvider({ children }: IContextProps) {
  const [userId, setUserId] = useState<number | null>(null)
  const [tipoLicenca, setTipoLicenca] = useState<number>(1)
  const [nomeUsuario, setNomeUsuario] = useState<string>('')
  const [emailUsuario, setEmailUsuario] = useState<string | null>(null)
  const [loginUsuario, setLoginUsuario] = useState<string>('')
  const [profileUrl, setProfileUrl] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') ? localStorage.getItem('token') : null,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setUserId(null)
      setNomeUsuario('')
      setEmailUsuario(null)
      setLoginUsuario('')
      setProfileUrl(null)
      setPermissions([])
      setLoading(false)
      return
    }

    const u = readFinTrackUsuario()
    if (u) {
      setUserId(u.id)
      setNomeUsuario(u.nomeExibicao?.trim() || u.login)
      setEmailUsuario(u.email?.trim() || null)
      setLoginUsuario(u.login)
      setProfileUrl(u.profile?.trim() || null)
      setTipoLicenca(u.licencaId ?? 0)
      setPermissions([...FINTRACK_PROVISIONAL_PERMISSIONS])
      setLoading(false)
      return
    }

    setUserId(null)
    setNomeUsuario('')
    setEmailUsuario(null)
    setLoginUsuario('')
    setProfileUrl(null)
    setPermissions([])
    setLoading(false)
  }, [token])

  return (
    <CurrentUserContext.Provider
      value={{
        userId,
        setUserId,
        setToken,
        permissions,
        loading,
        tipoLicenca,
        nomeUsuario,
        emailUsuario,
        loginUsuario,
        profileUrl,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}
