import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useTokenValidation = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkToken = () => {
      const expireTime = localStorage.getItem('expireTime')
      const token = localStorage.getItem('token')

      if (!token || !expireTime) {
        navigate('/login')
        return
      }

      const now = Date.now() // Tempo atual em milissegundos
      const expireTimestamp = parseInt(expireTime, 10) // Converte expireTime para número

      if (now >= expireTimestamp) {
        localStorage.removeItem('token')
        localStorage.removeItem('expireTime')
        navigate('/login')
      }
    }

    // Calcula o tempo até a próxima verificação com base na expiração
    const expireTime = localStorage.getItem('expireTime')
    const now = Date.now()
    const nextCheck = expireTime
      ? Math.max(parseInt(expireTime, 10) - now, 1000)
      : 60000

    const timeout = setTimeout(checkToken, nextCheck)

    return () => clearTimeout(timeout)
  }, [navigate])
}
