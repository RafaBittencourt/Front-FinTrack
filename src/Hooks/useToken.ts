// import { api } from '@/lib/axios'
import { IResponseRequestError } from '@/lib/interface'

export async function getUser() {
  if (localStorage.getItem('token')) {
    const timeOut = localStorage.getItem('expireTime')
    if (parseInt(timeOut || '1') > Date.now()) {
      return true
    } else {
      try {
        // const response = await api.get('api/TokenAuth/LogOut', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        // })
        // if (response.data.success) {
        // }
        localStorage.clear()
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'response' in e) {
          const error = e as IResponseRequestError
          return {
            success: error.response.data.success,
            message: error.response.data.error.message,
          }
        } else {
          return {
            success: false,
            message: 'An unexpected error occurred.',
          }
        }
      }
      return false
    }
  } else {
    return false
  }
}
