import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserData } from './context/userContext'

type IProtectedRoute = {
  children: React.ReactNode
  permission?: string | string[]
}

export function ProtectedRoute({ children, permission }: IProtectedRoute) {
  const { userId, loading, checkPermission } = useUserData()
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (userId === null) {
        navigate('/sign-in', { replace: true })
        return
      }

      if (permission && !checkPermission(permission)) {
        navigate('/dashboard', { replace: true })
        return
      }

      setChecked(true)
    }
  }, [loading, userId, permission, navigate, checkPermission])

  if (loading || !checked) {
    return <div>Loading...</div>
  }

  return children
}
