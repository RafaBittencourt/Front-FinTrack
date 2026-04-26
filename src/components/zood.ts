import { toast } from 'sonner'
import { ZodObject, ZodRawShape } from 'zod'

interface IResultValidationZood {
  result: boolean
  formErrors: Record<string, string> | null
}

export function ValidationZood<K extends ZodRawShape, T>(
  newHorasForm: ZodObject<K> | null | undefined,
  data: T,
  alert: boolean = false,
): IResultValidationZood {
  if (!newHorasForm || typeof newHorasForm.safeParse !== 'function') {
    const errorMessage = 'newHorasForm must be a valid ZodObject. Received:'
    if (alert) {
      toast.error(errorMessage)
    }
    return { result: false, formErrors: { general: errorMessage } }
  }

  const zodParse = newHorasForm.safeParse(data)

  if (!zodParse.success) {
    const error = zodParse.error
    let newErrors: Record<string, string> = {}
    for (const issue of error.issues) {
      newErrors = {
        ...newErrors,
        [issue.path.length > 1
          ? `${issue.path[2]}-${issue.path[1]}`
          : issue.path[0]]: issue.message,
      }
    }
    if (alert) {
      const errorMessage =
        Object.values(newErrors)[0] || 'Erro de validação encontrado'
      toast.error(errorMessage)
    }
    return { result: false, formErrors: newErrors }
  } else {
    return { result: true, formErrors: null }
  }
}
