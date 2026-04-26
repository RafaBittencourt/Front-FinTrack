export interface IResponseRequestError {
  response: {
    data: {
      error: {
        message: string
      }
      success: boolean
    }
  }
}

export interface IResponseError<T> {
  success: boolean
  message: string
  result?: T
}

// export type ProfilePicture = {
//   fileName: string
//   usuarioId?: number
//   fileType?: string
//   contentType?: string
//   base64Doc: string
// }

// export type ProfilePictureResponse = {
//   result?: {
//     licencaId: number
//     fileName: string
//     fileType: string
//     contentType: string
//     base64Doc: string
//     id: string
//   }
//   success: boolean
//   message: string
// }

// export type ProfilePictureResponsePhoto = {
//   result?: string
//   success: boolean
//   message: string
// }
