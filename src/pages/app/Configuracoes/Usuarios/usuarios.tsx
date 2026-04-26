import { useEffect, useRef, useState } from 'react'
import { useLoaderData } from 'react-router-dom'

import { BreadcrumbComponent } from '@/components/breadcrumb'
import {
  IPropsPagePaginationComponent,
  PaginationComponent,
} from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GetAllAsync } from '@/lib/crud'

import { FilterForm } from './filterForm'
import { IUsuarioProps, UsuarioFilterValues } from './interface'
import { UsuarioForm } from './usuarioForm'

export function Usuarios() {
  const usuario = useLoaderData() as IUsuarioProps
  const [usuarioData, setUsuarioData] = useState(usuario)
  const [filterData, setFilterData] = useState<UsuarioFilterValues>(
    {} as UsuarioFilterValues,
  )
  const [reloadTable, setReloadTable] = useState(false)
  const [displayData, setDisplayData] = useState(usuarioData.items)
  const [urlToRequest] = useState<string>('api/services/app/Usuario')
  const [propsPagination, setPropsPagination] =
    useState<IPropsPagePaginationComponent>(
      usuarioData as IPropsPagePaginationComponent,
    )
  const isFirstRender = useRef(true)

  async function reloadUsuarioTable() {
    const response = await GetAllAsync<UsuarioFilterValues, IUsuarioProps>(
      filterData,
      urlToRequest,
    )
    setPropsPagination(response.result as IUsuarioProps)
    setUsuarioData(response.result as IUsuarioProps)
  }

  useEffect(() => {
    if (reloadTable) {
      reloadUsuarioTable()
      setReloadTable(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadTable])

  useEffect(() => {
    setDisplayData(usuarioData.items)
  }, [usuarioData])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    reloadUsuarioTable()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData])

  // const tipoUsuarioEnum = {
  //   0: 'Master',
  //   1: 'Diretor',
  //   2: 'Gerente',
  //   3: 'Parceiro de Negócio',
  //   4: 'Executivo',
  //   5: 'Executivo Base',
  //   6: 'Gerente de Canais',
  //   7: 'Gerente de Base',
  //   8: 'Pré-Venda Consultor',
  // } as const

  return (
    <div className="flex h-full flex-col">
      <div className="border-b-1 flex h-16 items-center justify-between gap-6 border-foreground bg-muted px-6 font-semibold text-foreground">
        <BreadcrumbComponent
          routes={[
            { displayRout: 'Configurações', route: '' },
            { displayRout: 'Usuarios', route: '' },
          ]}
        />
        <span className="flex gap-4">
          <UsuarioForm
            setReloadTable={setReloadTable}
            typeRequest={'create'}
            urlToRequest={urlToRequest}
          />
          <FilterForm
            reloadUsuarioTable={reloadUsuarioTable}
            setFilterData={setFilterData}
          />
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="w-[70px]">Ações</TableHead>
                <TableHead className="w-[200px]">Usuario</TableHead>
                <TableHead className="w-[250px]">Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[100px]">Ativo</TableHead>
                <TableHead className="w-[150px]">Tipo Usuario</TableHead>
                {/* <TableHead className="w-[150px]">Email confirmado</TableHead> */}
                <TableHead className=" w-[100px] text-right">
                  Criado em
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((data) => (
                <TableRow key={data.id} className="hover:bg-accent h-[30px]">
                  <TableCell className="w-[70px] font-medium">
                    <UsuarioForm
                      setReloadTable={setReloadTable}
                      typeRequest={'update'}
                      dataId={data.id}
                      urlToRequest={urlToRequest}
                    />
                  </TableCell>
                  <TableCell className="w-[200px] font-medium">
                    {data.nomeUsuario}
                  </TableCell>
                  <TableCell className="w-[250px] font-medium">
                    {data.nomeCompleto}
                  </TableCell>

                  <TableCell className="font-medium">
                    {data.emailAddress}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    {data.isActive ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell className="w-[150px]">{data.nomeFuncao}</TableCell>
                  {/* <TableCell className="w-[150px] justify-items-center font-medium">
                    {data.isEmailConfirmed ? (
                      <ShieldCheck color="green"></ShieldCheck>
                    ) : (
                      <ShieldX color="red"></ShieldX>
                    )}
                  </TableCell> */}
                  <TableCell className="w-[100px] text-right">
                    {new Date(data.criadoEm).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex-shrink-0">
        <PaginationComponent
          propsPagination={propsPagination}
          handlePagination={(value) =>
            setFilterData((prev) => ({
              ...prev,
              pageNumber: Number(value),
            }))
          }
          handleMaxResultCount={(maxResultCount) =>
            setFilterData((prev) => ({
              ...prev,
              pageNumber: 1,
              maxResultCount: Number(maxResultCount),
            }))
          }
        />
      </div>
    </div>
  )
}
