import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Cross, Pencil, Ticket, Database, Settings } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ValidationZood } from '@/components/zood'
import { CreateAsync, GetAsync, GetDinamicAsync, UpdateAsync } from '@/lib/crud'
import { IResponseError } from '@/lib/interface'
import { useUserData } from '@/context/userContext'

import { FuncoesFilterValues, FuncoesFormValues } from './interface'

interface INewFuncoesProps {
  setReloadTable: React.Dispatch<React.SetStateAction<boolean>>
  typeRequest: 'create' | 'update'
  dataId?: number
  urlToRequest: string
}

const newFuncoesForm = z.object({
  nome: z.string().trim().min(1, 'Título deve ser informado.'),
  displayName: z.string().trim().min(1, 'Descrição deve ser informada.'),
  descricao: z.string().trim().min(1, 'Descrição deve ser informada.'),
})
export function NewFuncoes({
  setReloadTable,
  typeRequest,
  dataId,
  urlToRequest,
}: INewFuncoesProps) {
  const { checkPermission } = useUserData()
  const [isOpen, setIsOpen] = useState(false)

  // Usaremos watch para monitorar as mudanças e forçar re-renderização quando necessário
  // ou confiar no Controller do react-hook-form para os inputs individuais
  const { register, control, handleSubmit, reset, setValue, getValues, watch } = useForm<FuncoesFormValues>(
    {
      defaultValues: {},
    },
  )

  // Monitora alterações nas categorias para atualizar a UI reativamente
  const categorias = watch('categorias') || []

  // Mapa de ícones para as categorias
  const iconMap: Record<string, React.ReactNode> = {
    ticket: <Ticket className="h-4 w-4" />,
    database: <Database className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
  }

  async function handleOpen(opening: boolean) {
    if (dataId) {
      const response = await GetAsync<FuncoesFormValues>(dataId, urlToRequest)

      if (response.result) {
        reset(response.result)
      }
      setIsOpen(opening)
    } else {
      const response = await GetDinamicAsync<FuncoesFormValues, FuncoesFilterValues>(
        urlToRequest + '/GetPermissions',
        {} as FuncoesFilterValues
      )

      if (response.result) {
        reset({
          categorias: response.result.categorias,
        })
        setIsOpen(opening)
      }
    }
  }

  async function onSubmit(data: FuncoesFormValues) {
    if (ValidationZood(newFuncoesForm, data, true).result) {
      let response: IResponseError<FuncoesFormValues> =
        {} as IResponseError<FuncoesFormValues>

      if (typeRequest === 'create')
        response = await CreateAsync(data, 'api/services/app/Funcao')

      if (typeRequest === 'update')
        response = await UpdateAsync(data, 'api/services/app/Funcao')

      if (response.result) {
        toast.success(
          typeRequest === 'create'
            ? 'Função criada com sucesso'
            : 'Função atualizada com sucesso',
        )
        setReloadTable(true)
        setIsOpen(false)
        reset()
      } else {
        toast.error(response.message)
      }
    }
  }

  // Função para alternar todas as permissões de um grupo dentro de uma categoria
  const toggleGroupPermissions = (catIndex: number, groupIndex: number, isChecked: boolean) => {
    const currentPermissions = getValues(`categorias.${catIndex}.grupos.${groupIndex}.permissoes`)
    currentPermissions.forEach((_, permIndex) => {
      setValue(`categorias.${catIndex}.grupos.${groupIndex}.permissoes.${permIndex}.permitido`, isChecked, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    })
  }

  // Verifica se todas as permissões de um grupo estão marcadas
  const isGroupAllChecked = (catIndex: number, groupIndex: number) => {
    const permissions = categorias[catIndex]?.grupos[groupIndex]?.permissoes || []
    return permissions.length > 0 && permissions.every((p) => p.permitido)
  }

  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger asChild>
          {typeRequest === 'create' ? (
            <>
              {checkPermission("Support.Configuracao.Funcao.Criar") ? (
                <Button onClick={() => handleOpen(true)}>
                  <Cross className="mr-2 h-4 w-4" /> Nova Função
                </Button>
              ) : (
                <Button disabled>
                  <Cross className="mr-2 h-4 w-4" /> Nova Função
                </Button>
              )}
            </>
          ) : typeRequest === 'update' ? (
            <>
              {checkPermission("Support.Configuracao.Funcao.Atualizar") ? (
                <Button
                  size="defaultButtonEditRegister"
                  variant="outline"
                  onClick={() => handleOpen(true)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  size="defaultButtonEditRegister"
                  variant="outline"
                  disabled
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </>
          ) : (
            <></>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="w-full max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden">
          <AlertDialogHeader className="px-6 pt-6 pb-2">
            {typeRequest === 'create' ? (
              <AlertDialogTitle>Criando nova Função</AlertDialogTitle>
            ) : (
              <AlertDialogTitle>Atualizando Função</AlertDialogTitle>
            )}
          </AlertDialogHeader>

          <form
            className="flex flex-col flex-1 overflow-hidden"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4 px-6 py-2 border-b bg-muted/20">
              <div className="flex flex-row gap-4">
                <div className="w-1/3">
                  <Label htmlFor="nome">Nome Interno</Label>
                  <Input id="nome" placeholder="Ex: Admin" {...register('nome')} />
                </div>
                <div className="w-1/3">
                  <Label htmlFor="displayName">Nome de Exibição</Label>
                  <Input id="displayName" placeholder="Ex: Administrador do Sistema" {...register('displayName')} />
                </div>
                <div className="w-1/3">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input id="descricao" placeholder="Descrição completa da função..." {...register('descricao')} />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {categorias.length > 0 ? (
                <Tabs defaultValue={categorias[0].nome} orientation="vertical" className="flex-1 flex flex-row overflow-hidden h-full min-h-0">
                  {/* Sidebar Esquerda - Lista de Categorias */}
                  <div className="w-64 border-r bg-muted/10 h-full flex flex-col flex-shrink-0">
                    <div className="p-4 border-b flex-shrink-0">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categorias</h3>
                    </div>
                    <ScrollArea className="flex-1">
                      <TabsList className="flex flex-col w-full h-auto bg-transparent p-2 gap-1 justify-start">
                        {categorias.map((cat, index) => (
                          <TabsTrigger
                            key={index}
                            value={cat.nome}
                            className="w-full justify-start px-3 py-2 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md transition-all hover:bg-muted/50 flex items-center gap-3"
                          >
                            {iconMap[cat.icone] || <Settings className="h-4 w-4 opacity-70" />}
                            <span className="truncate">{cat.nome}</span>
                            <span className="ml-auto text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded-full border">
                              {cat.grupos.reduce((acc, g) => acc + g.permissoes.length, 0)}
                            </span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </ScrollArea>
                  </div>

                  {/* Conteúdo Direita - Grupos e Permissões */}
                  <div className="flex-1 flex flex-col h-full overflow-hidden bg-background min-h-0">
                    {categorias.map((cat, catIndex) => (
                      <TabsContent key={catIndex} value={cat.nome} className="flex-1 h-full m-0 data-[state=active]:flex flex-col overflow-hidden min-h-0">
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-card flex-shrink-0 relative z-20 shadow-sm">
                          <div className="flex items-center gap-2">
                            {iconMap[cat.icone] || <Settings className="h-5 w-5 text-muted-foreground" />}
                            <h2 className="text-lg font-semibold tracking-tight">{cat.nome}</h2>
                          </div>
                        </div>

                        {/* Área de Scroll Nativa */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                          <div className="flex flex-col pb-6">
                            {cat.grupos.map((grupo, gIndex) => (
                              <div key={gIndex} className="px-6">
                                {/* Título do Grupo com Sticky Header Ajustado */}
                                <div className={`flex items-center justify-between border-b pb-2 sticky top-0 bg-background z-10 mb-3 ${gIndex === 0 ? 'pt-4' : 'pt-6'}`}>
                                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    {grupo.nome}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <Label
                                      htmlFor={`group-toggle-${catIndex}-${gIndex}`}
                                      className="text-xs font-medium cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      {isGroupAllChecked(catIndex, gIndex) ? 'Desmarcar Todos' : 'Selecionar Todos'}
                                    </Label>
                                    <input
                                      id={`group-toggle-${catIndex}-${gIndex}`}
                                      type="checkbox"
                                      className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                                      checked={isGroupAllChecked(catIndex, gIndex)}
                                      onChange={(e) => toggleGroupPermissions(catIndex, gIndex, e.target.checked)}
                                    />
                                  </div>
                                </div>

                                {/* Formato Lista Compacta */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2">
                                  {grupo.permissoes.map((permissao, pIndex) => (
                                    <div
                                      key={pIndex}
                                      className="flex items-start space-x-2.5 p-1.5 rounded-md hover:bg-muted/40 transition-colors group"
                                    >
                                      <Controller
                                        control={control}
                                        name={`categorias.${catIndex}.grupos.${gIndex}.permissoes.${pIndex}.permitido`}
                                        render={({ field }) => (
                                          <input
                                            type="checkbox"
                                            id={`perm-${catIndex}-${gIndex}-${pIndex}`}
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary shrink-0"
                                          />
                                        )}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <label
                                          htmlFor={`perm-${catIndex}-${gIndex}-${pIndex}`}
                                          className="text-sm text-foreground font-medium leading-tight cursor-pointer select-none block truncate"
                                          title={permissao.nome}
                                        >
                                          {permissao.nome}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <span className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4 animate-pulse" /> Carregando permissões...
                  </span>
                </div>
              )}
            </div>

            <AlertDialogFooter className="p-6 border-t mt-auto bg-background">
              <AlertDialogCancel type="button" onClick={() => setIsOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction type="submit" className="w-32">
                {typeRequest === 'create' ? 'Criar' : 'Salvar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
