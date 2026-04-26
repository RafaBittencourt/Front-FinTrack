import { Save } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLoaderData } from 'react-router-dom'

import { BreadcrumbComponent } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GetAllAsync } from '@/lib/crud'

import {
  ConfiguracoesFilterValues,
  ConfiguracoesFormValues,
  IConfiguracoesProps,
} from './interface'

export function Configuracoes() {
  const configuracoes = useLoaderData() as IConfiguracoesProps
  // const [tabId, setTabId] = useState(1)

  const [configuracoesData, setConfiguracoesData] = useState(configuracoes)
  // const [reloadTable, setReloadTable] = useState(false)
  const [urlToRequest] = useState<string>('api/services/app/Funcao')

  const { register, handleSubmit } = useForm<ConfiguracoesFormValues>({
    defaultValues: configuracoesData.items,
  })

  // useEffect(() => {
  //   if (reloadTable) {
  //     setReloadTable(false)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [reloadTable])

  async function onSubmit() {
    const response = await GetAllAsync<
      ConfiguracoesFilterValues,
      IConfiguracoesProps
    >({} as ConfiguracoesFilterValues, urlToRequest)
    setConfiguracoesData(response.result as IConfiguracoesProps)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b-1 flex h-16 items-center justify-between gap-6 border-foreground bg-muted px-6 font-semibold text-foreground">
        <BreadcrumbComponent
          routes={[
            { displayRout: 'Cadastros', route: '' },
            { displayRout: 'Configuracoes', route: '' },
          ]}
        />
        <span className="flex gap-4">
          <Button onClick={() => onSubmit()}>
            <Save className="mr-2 h-4 w-4" /> Salvar
          </Button>
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        // className="flex flex-1 flex-col overflow-auto"
      >
        <Tabs
          defaultValue="usuario"
          className="w-full p-4"
          // onValueChange={(value) =>
          //   setTabId(value === 'contatos' ? 2 : value === 'filiais' ? 1 : 3)
          // }
        >
          <div className="flex w-full flex-row justify-between">
            <TabsList className="grid w-[400px] grid-cols-3">
              <TabsTrigger value="usuario">Usuarios</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="usuario"
            className="max-h-[calc(100vh-145px)] overflow-auto rounded-lg border-2 border-foreground/15 p-4"
          >
            <div className="flex max-h-[300px] flex-row gap-4 overflow-auto">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" {...register('displayName')} />
              </div>
              <div className="w-1/3">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" {...register('descricao')} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
