import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { api } from '@/lib/axios'

interface CurrentUserContextType {
  userId: number | null
  setUserId: React.Dispatch<React.SetStateAction<number | null>>
  permissions: string[]
  tipoLicenca: number
  setToken: React.Dispatch<React.SetStateAction<string | null>>
  loading: boolean
  nomeUsuario: string
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
  const [permissions, setPermissions] = useState<string[]>([])
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') ? localStorage.getItem('token') : null,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api
        .get(`${'api/services/app/ParametroSistema/GetAllSettings'}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
          setUserId(response.data.result.usuarioId)
          setTipoLicenca(response.data.result.tipoLicenca)
          setNomeUsuario(response.data.result.nomeUsuario)
          setPermissions(response.data.result.permissions)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
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
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}
