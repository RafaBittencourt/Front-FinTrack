import { Cross, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { InputSelect } from '@/components/InputSelect/InputSelect'
import {
  AlertDialog,
  AlertDialogAction,
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
import { handleCpfCnpjMsk, handlePhoneMsk } from '@/lib/maskFunction'

import { UsuarioFormValues } from './interface'
import { DynamicSelect } from '@/components/ui/selectSearch'
import { useUserData } from '@/context/userContext'

interface IUsuarioFormProps {
  setReloadTable: React.Dispatch<React.SetStateAction<boolean>>
  typeRequest: 'create' | 'update'
  dataId?: number
  urlToRequest: string
}

const newUsuarioForm = z
  .object({
    nomeUsuario: z.string().min(1, { message: 'Obrigatório' }),
    nome: z.string().min(1, { message: 'Obrigatório' }),
    sobrenome: z.string().min(1, { message: 'Obrigatório' }),
    // cpfCnpj: z.string().min(1, { message: 'Obrigatório' }),
    emailAddress: z.string().min(1, { message: 'Obrigatório' }),
    password: z.string().nullable().optional(),
    confirmPassword: z.string().nullable().optional(),
    numeroTelefone: z
      .string()
      .min(10, { message: 'Telefone inválido' })
      .max(15, { message: 'Telefone inválido' }),
    empresaId: z.string(),
    grupoUsuarioId: z.string(),
  })
  .refine(
    (data) => {
      // Só aplica a validação se password tiver valor (não for null, undefined ou vazio)
      if (data.password) {
        return data.password === data.confirmPassword
      }
      return true // Se password não estiver preenchido, ignora a validação
    },
    {
      message: 'Senhas não coincidem',
      path: ['confirmPassword'],
    },
  )

export function UsuarioForm({
  setReloadTable,
  typeRequest,
  dataId,
  urlToRequest,
}: IUsuarioFormProps) {
  const { checkPermission } = useUserData()
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isOpen, setIsOpen] = useState(false)

  const { register, control, handleSubmit, reset, getValues } =
    useForm<UsuarioFormValues>({
      defaultValues: {
        isActive: 'true',
        isLockEnabled: 'false',
      },
    })

  async function handleOpen(opening: boolean) {
    if (dataId) {
      const response = await GetAsync<UsuarioFormValues>(dataId, urlToRequest)

      if (response.result) {
        reset({
          ...response.result,
          isActive: String(response.result.isActive),
          isLockEnabled: String(response.result.isLockEnabled),
          empresaId: response.result.empresaId?.toString(),
          grupoUsuarioId: response.result.grupoUsuarioId?.toString(),
        })
      }
      setIsOpen(opening)
    } else {
      setIsOpen(opening)
    }
  }

  async function onSubmit(data: UsuarioFormValues) {
    const zodParse = newUsuarioForm.safeParse(data)
    console.log(zodParse)
    if (!zodParse.success) {
      const error = zodParse.error
      let newErrors = {}
      for (const issue of error.issues) {
        newErrors = {
          ...newErrors,
          [issue.path.length > 1
            ? `${issue.path[2]}-${issue.path[1]}`
            : issue.path[0]]:
            issue.message === 'Required' ? 'Obrigatório' : issue.message,
        }
      }
      setFormErrors(newErrors)
    } else {
      setFormErrors({})

      let response: IResponseError<UsuarioFormValues> =
        {} as IResponseError<UsuarioFormValues>

      if (typeRequest === 'create')
        response = await CreateAsync(data, 'api/services/app/Usuario')

      if (typeRequest === 'update')
        response = await UpdateAsync(data, 'api/services/app/Usuario')

      if (response.result) {
        toast.success(
          typeRequest === 'create'
            ? 'Usuario criado com sucesso'
            : 'Usuario atualizado com sucesso',
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
            <>
              {checkPermission("Support.Configuracao.Usuario.Criar") ? (
                <Button onClick={() => handleOpen(true)}>
                  <Cross className="mr-2 h-4 w-4" /> Novo Usuario
                </Button>
              ) : (
                <>
                  <Button disabled>
                    <Cross className="mr-2 h-4 w-4" /> Novo Usuario
                  </Button>
                </>
              )}
            </>
          ) : typeRequest === 'update' ? (
            <>
              {checkPermission("Support.Configuracao.Usuario.Atualizar") ? (
                <Button
                  size="defaultButtonEditRegister"
                  variant="outline"
                  onClick={() => handleOpen(true)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              ) : (
                <>
                  <Button
                    size="defaultButtonEditRegister"
                    variant="outline"
                    disabled
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[65.625rem]">
          <AlertDialogHeader>
            {typeRequest === 'create' ? (
              <AlertDialogTitle>Criando novo Usuario</AlertDialogTitle>
            ) : (
              <AlertDialogTitle>
                Atualizando Usuario: {getValues('nomeCompleto')}
              </AlertDialogTitle>
            )}
          </AlertDialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-row gap-10">
              <div className="flex flex-col">
                <div className="flex w-[62.5rem] flex-row gap-4">
                  <div className="w-1/4">
                    <Label htmlFor="nomeUsuario">Nome Usuario</Label>
                    <Input id="nomeUsuario" {...register('nomeUsuario')} />
                    {formErrors.nomeUsuario && (
                      <p className="text-destructive">
                        {formErrors.nomeUsuario}
                      </p>
                    )}
                  </div>
                  <div className="w-1/4">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" {...register('nome')} />
                    {formErrors.nome && (
                      <p className="text-destructive">{formErrors.nome}</p>
                    )}
                  </div>
                  <div className="w-1/4">
                    <Label htmlFor="sobrenome">Sobrenome</Label>
                    <Input id="sobrenome" {...register('sobrenome')} />
                    {formErrors.sobrenome && (
                      <p className="text-destructive">{formErrors.sobrenome}</p>
                    )}
                  </div>
                  <div className="w-1/4">
                    <Label htmlFor="funcoes">Função</Label>
                    <Controller
                      name="funcoes"
                      control={control}
                      render={({ field }) => (
                        <DynamicSelect
                          disabled={!checkPermission("Support.Configuracao.Usuario.ChangePermissions")}
                          apiEndpoint="/api/services/app/Funcao/GetAllSelect"
                          placeholder="Selecione..."
                          displayField={'displayName'}
                          valueField={'nome'}
                          value={field.value}
                          onValueChange={field.onChange}
                          ref={field.ref}
                        />
                      )}
                    />
                  </div>
                  <div className="w-1/6">
                    <InputSelect
                      label="Status"
                      className="border-black"
                      name="isActive"
                      control={control}
                      selectOptions={[
                        {
                          value: 'true',
                          display: 'Ativo',
                        },
                        {
                          value: 'false',
                          display: 'Inativo',
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* ------------------------------------------------------------------------------------------------------------------------------- */}

                <div className="flex flex-row gap-4">
                  <div className="w-1/6">
                    <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                    <Input
                      id="cpfCnpj"
                      onKeyUp={handleCpfCnpjMsk}
                      maxLength={18}
                      {...register('cpfCnpj')}
                    />
                    {formErrors.cpfCnpj && (
                      <p className="text-destructive">{formErrors.cpfCnpj}</p>
                    )}
                  </div>
                  <div className="w-1/3">
                    <Label htmlFor="emailAddress">E-mail</Label>
                    <Input id="emailAddress" {...register('emailAddress')} />
                    {formErrors.emailAddress && (
                      <p className="text-destructive">
                        {formErrors.emailAddress}
                      </p>
                    )}
                  </div>
                  <div className="w-1/5">
                    <Label htmlFor="numeroTelefone">Telefone</Label>
                    <Input
                      id="numeroTelefone"
                      onKeyUp={handlePhoneMsk}
                      {...register('numeroTelefone')}
                    />
                    {formErrors.numeroTelefone && (
                      <p className="text-destructive">
                        {formErrors.numeroTelefone}
                      </p>
                    )}
                  </div>
                  <div className="w-1/10">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type={'password'}
                      disabled={!checkPermission("Support.Configuracao.Usuario.ChangePassword")}
                      {...register('password')}
                    />
                    {formErrors.password && (
                      <p className="text-destructive">{formErrors.password}</p>
                    )}
                  </div>
                  <div className="w-1/10">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type={'password'}
                      disabled={!checkPermission("Support.Configuracao.Usuario.ChangePassword")}
                      {...register('confirmPassword')}
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-destructive">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row gap-4 items-end">
                  <div className="w-2/6">
                    <Label htmlFor="grupoUsuarioId">Grupo de Usuário</Label>
                    <Controller
                      name="grupoUsuarioId"
                      control={control}
                      render={({ field }) => (
                        <DynamicSelect
                          disabled={!checkPermission("Support.Configuracao.Usuario.Atualizar")}
                          apiEndpoint="/api/services/app/GrupoUsuario/GetAllSelect"
                          placeholder="Selecione o grupo de usuário..."
                          displayField={'nome'}
                          value={field.value}
                          onValueChange={field.onChange}
                          ref={field.ref}
                        />
                      )}
                    />
                    {formErrors.grupoUsuarioId && (
                      <p className="text-destructive">
                        {formErrors.grupoUsuarioId}
                      </p>
                    )}
                  </div>
                  <div className="w-3/6">
                    <Label htmlFor="empresaId">Empresa</Label>
                    <Controller
                      name="empresaId"
                      control={control}
                      render={({ field }) => (
                        <DynamicSelect
                          disabled={!checkPermission("Support.Configuracao.Usuario.Atualizar")}
                          apiEndpoint="/api/services/app/Empresa/GetAllSelect"
                          placeholder="Selecione a empresa..."
                          displayField={'nome'}
                          value={field.value}
                          onValueChange={field.onChange}
                          ref={field.ref}
                        />
                      )}
                    />
                    {formErrors.empresaId && (
                      <p className="text-destructive">
                        {formErrors.empresaId}
                      </p>
                    )}
                  </div>
                  <div className="w-1/6 pb-[1px]">
                    <InputSelect
                      label="Usuário bloqueado"
                      disabled={!checkPermission("Support.Configuracao.Usuario.Atualizar")}
                      className="border-black"
                      name="isLockEnabled"
                      control={control}
                      selectOptions={[
                        {
                          value: 'true',
                          display: 'Sim',
                        },
                        {
                          value: 'false',
                          display: 'Não',
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* ------------------------------------------------------------------------------------------------------------------------------- */}

                {/* <div className=" flex flex-row gap-4">
                                <div className="w-1/3">
                                  <Label htmlFor="nomeFuncoes">Função</Label>
                                  <Input
                                    id="nomeFuncoes"
                                    disabled={true}
                                    {...register('nomeFuncoes')}
                                  />
                                  {formErrors.nomeFuncoes && (
                                    <p className="text-destructive">
                                      {formErrors.nomeFuncoes}
                                    </p>
                                  )}
                                </div>
                              </div> */}

                {/* ------------------------------------------------------------------------------------------------------------------------------- */}

                <div className=" flex flex-row gap-4">
                  {/* <div className="w-1/3 pb-3 pt-9 align-bottom">
                                  <InputCheckbox
                                    defaultValue={false}
                                    name={'setRandomPassword'}
                                    label={'Definir senha aleatoria'}
                                    className={'pr-4'}
                                    control={control}
                                  />
                                </div> */}
                  {/* {!watch('setRandomPassword') && <></>} */}
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button" onClick={() => setIsOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction type="submit">Salvar</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
