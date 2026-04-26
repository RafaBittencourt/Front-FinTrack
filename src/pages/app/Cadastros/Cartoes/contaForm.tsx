import { Landmark, Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateAsync, GetAsync, UpdateAsync } from '@/lib/crud'
import { IResponseError } from '@/lib/interface'

import { ContaFormValues } from './interface'
import { InputSelect } from '@/components/InputSelect/InputSelect'

interface IContaFormProps {
  setReloadTable: React.Dispatch<React.SetStateAction<boolean>>
  typeRequest: 'create' | 'update'
  dataId?: number
  urlToRequest: string
}

const contaFormSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  type: z.coerce.number(),
  balance: z.coerce.number(),
  color: z.string().nonempty('Cor é obrigatória'),
})

export function ContaForm({
  setReloadTable,
  typeRequest,
  dataId,
  urlToRequest,
}: IContaFormProps) {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isOpen, setIsOpen] = useState(false)

  const { register, control, handleSubmit, reset } =
    useForm<ContaFormValues>({
      defaultValues: {
        id: 0,
        isActive: true,
        type: 0,
        balance: 0,
        color: '#10b981', // Default emerald green
      },
    })

  async function handleOpen(opening: boolean) {
    if (dataId) {
      const response = await GetAsync<ContaFormValues>(
        dataId,
        urlToRequest,
      )

      if (response.result) {
        reset(response.result)
      }
      setIsOpen(opening)
    } else {
      setIsOpen(opening)
    }
  }

  async function onSubmit(data: ContaFormValues) {
    const zodParse = contaFormSchema.safeParse(data)
    if (!zodParse.success) {
      const error = zodParse.error
      let newErrors = {}
      for (const issue of error.issues) {
        newErrors = {
          ...newErrors,
          [issue.path[0]]: issue.message,
        }
      }
      setFormErrors(newErrors)
    } else {
      setFormErrors({})

      let response: IResponseError<ContaFormValues> =
        {} as IResponseError<ContaFormValues>

      if (typeRequest === 'create')
        response = await CreateAsync(data, urlToRequest)

      if (typeRequest === 'update')
        response = await UpdateAsync(data, urlToRequest)

      if (response.result) {
        toast.success(
          typeRequest === 'create'
            ? 'Conta criada com sucesso'
            : 'Conta atualizada com sucesso',
        )
        setReloadTable(true)
        setIsOpen(false)
        reset()
      } else {
        toast.error(response.message)
      }
    }
  }

  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger asChild>
          {typeRequest === 'create' ? (
            <Button
              size="sm"
              onClick={() => handleOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md active:scale-95"
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Conta
            </Button>
          ) : (
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
              onClick={() => handleOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-md bg-white border-emerald-50 shadow-2xl rounded-2xl p-4 md:p-6">
          <AlertDialogHeader className="border-b border-emerald-50 pb-3 mb-3">
            <AlertDialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                <Landmark size={18} />
              </div>
              {typeRequest === 'create' ? 'Configurar Nova Conta' : 'Editar Conta'}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-slate-700 text-left block">Nome da Instituição</Label>
              <Input
                id="name"
                placeholder="Ex: Sicredi, Nubank..."
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                {...register('name')}
              />
              {formErrors.name && (
                <p className="text-xs font-medium text-red-500 text-left">{formErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 text-left">
                <InputSelect
                  label="Tipo de Conta"
                  name="type"
                  control={control}
                  selectOptions={[
                    { value: '0', display: 'Conta Corrente' },
                    { value: '1', display: 'Poupança' },
                    { value: '2', display: 'Caixa (Dinheiro)' },
                    { value: '3', display: 'Carteira' },
                  ]}
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="balance" className="text-sm font-bold text-slate-700">Saldo Inicial</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  className="border-slate-200"
                  {...register('balance')}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="color" className="text-sm font-bold text-slate-700">Cor de Identificação</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="color"
                  type="color"
                  className="w-full h-9 p-1 rounded-lg border-slate-200 cursor-pointer"
                  {...register('color')}
                />
                <div
                  className="w-9 h-9 rounded-full border border-slate-200 shadow-inner"
                  style={{ backgroundColor: control._formValues.color }}
                />
              </div>
            </div>

            <AlertDialogFooter className="border-t border-emerald-50 pt-3 gap-2">
              <AlertDialogCancel
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </AlertDialogCancel>
              <Button
                type="submit"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/20 px-8"
              >
                Salvar Conta
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog >
    </>
  )
}
