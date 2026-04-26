import { api } from './axios'
import {
  IResponseError,
  IResponseRequestError,
} from './interface'

export async function CreateAsync<T>(
  data: T,
  url: string,
): Promise<IResponseError<T>> {
  try {
    console.log('data => ', data)
    const response = await api.post(`${url}/Create`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    return {
      result: response.data.result as T,
      success: true,
      message: 'Success',
    }
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
}

export async function UpdateAsync<T, A>(
  data: T,
  url: string,
): Promise<IResponseError<A>> {
  try {
    const response = await api.put(`${url}/Update`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    return {
      result: response as A,
      success: response.data.result,
      message: 'Success',
    }
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
}

export async function GetAllAsync<T, A>(
  dataFilter: T,
  url: string,
): Promise<IResponseError<A>> {
  try {
    const filterArray = Object.entries(dataFilter as object)
    let quaryFilter = ''
    filterArray.forEach((paramToFilter) => {
      const key = paramToFilter[0]
      const val = paramToFilter[1]

      if (key === 'statusFiltro' || key === 'slaFiltro') return

      if (val !== undefined && val !== '' && val !== 'todos' && val !== null) {
        if (Array.isArray(val)) {
          val.forEach((item) => {
            quaryFilter += `${key}=${item}&`
          })
        } else {
          quaryFilter += `${key}=${val}&`
        }
      }
    })

    const response = await api.get(
      `${url}/GetAll?${quaryFilter ? `${quaryFilter}` : ''}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    )

    return {
      result: response.data.result as A,
      success: response.data.success,
      message: 'Success',
    }
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
}

export async function GetAsync<T>(
  dataId: number,
  url: string,
): Promise<IResponseError<T>> {
  try {
    const response = await api.get(`${url}/Get?id=${dataId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    console.log(response)

    return {
      result: response.data.result as T,
      success: response.data.success,
      message: 'Success',
    }
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
}

export async function GetDinamicAsync<T, K extends object>(
  url: string,
  dataFilter?: K,
): Promise<IResponseError<T>> {
  try {
    const filterArray = Object.entries(dataFilter as object)
    let quaryFilter = ''
    filterArray.forEach((paramToFilter) => {
      const key = paramToFilter[0]
      const val = paramToFilter[1]

      if (key === 'statusFiltro' || key === 'slaFiltro') return

      if (val !== undefined && val !== '' && val !== 'todos' && val !== null) {
        if (Array.isArray(val)) {
          val.forEach((item) => {
            quaryFilter += `${key}=${item}&`
          })
        } else {
          quaryFilter += `${key}=${val}&`
        }
      }
    })

    console.log('quaryFilter => ', quaryFilter)

    const response = await api.get(
      `${url}${quaryFilter ? `?${quaryFilter}` : ''}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    )

    console.log(response)

    return {
      result: response.data.result.items as T,
      success: response.data.success,
      message: 'Success',
    }
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
}

export async function UploadFile<T>(data: T): Promise<IResponseError<T>> {
  try {
    const response = await api.post(
      `api/services/app/UploadToGoogleDrive`,
      data,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    )

    return {
      result: response.data.result as T,
      success: true,
      message: 'Success',
    }
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
}

export async function ReleasedAsync<T, A>(
  data: T,
  url: string,
): Promise<IResponseError<A>> {
  try {
    const response = await api.post(`${url}/Release`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    return {
      result: response as A,
      success: response.data.result,
      message: 'Success',
    }
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
}

// ----------------------------------------------------- PROFILE PICTURE ----------------------------------------------------- \\

// export async function CreateProfilePicture(
//   data: ProfilePicture,
// ): Promise<ProfilePictureResponse> {
//   try {
//     const response = await api.post(
//       `api/services/app/Profile/CreateOrUpdateProfilePicture`,
//       data,
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       },
//     )

//     return {
//       result: response.data.result,
//       message: 'Success',
//       success: true,
//     }
//   } catch (e: unknown) {
//     if (e && typeof e === 'object' && 'response' in e) {
//       const error = e as IResponseRequestError
//       return {
//         success: false,
//         message: error.response.data.error.message,
//       }
//     } else {
//       return {
//         success: false,
//         message: 'An unexpected error occurred.',
//       }
//     }
//   }
// }

// export async function GetProfilePicture(
//   guid: string,
// ): Promise<ProfilePictureResponsePhoto> {
//   try {
//     const response = await api.get(
//       `api/services/app/Profile/GetProfilePicture?input=${guid}`,
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       },
//     )

//     return {
//       result: response.data.result.profilePicture,
//       message: 'Success',
//       success: true,
//     }
//   } catch (e: unknown) {
//     if (e && typeof e === 'object' && 'response' in e) {
//       const error = e as IResponseRequestError
//       return {
//         success: false,
//         message: error.response.data.error.message,
//       }
//     } else {
//       return {
//         success: false,
//         message: 'An unexpected error occurred.',
//       }
//     }
//   }
// }

// export function CreateObjectProfilePicture(
//   blobProfilePicture: FileList,
//   callback: (profilePicture: ProfilePicture | null) => void,
// ): void {
//   const reader = new FileReader()

//   reader.onloadend = () => {
//     if (reader.result && typeof reader.result === 'string') {
//       const base64String = reader.result.split(',')[1]

//       const file = blobProfilePicture[0]
//       const newFileObject: ProfilePicture = {
//         fileName: file.name,
//         fileType: file.type,
//         contentType: file.type,
//         base64Doc: base64String,
//       }

//       callback(newFileObject)
//     } else {
//       callback(null)
//     }
//   }

//   reader.onerror = () => {
//     callback(null)
//   }

//   reader.readAsDataURL(blobProfilePicture[0])
// }
