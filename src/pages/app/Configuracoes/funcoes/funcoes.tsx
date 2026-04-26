import { format } from 'date-fns'
import { Badge, BadgeCheck } from 'lucide-react'
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
import { NewFuncoes } from './funcoesForm'
import { FuncoesFilterValues, IFuncoesProps } from './interface'

export function Funcoes() {
  const funcoes = useLoaderData() as IFuncoesProps
  const [funcoesData, setFuncoesData] = useState(funcoes)
  const [filterData, setFilterData] = useState<FuncoesFilterValues>(
    {
      pageNumber: 1,
      maxResultCount: 20,
    } as FuncoesFilterValues,
  )
  const [reloadTable, setReloadTable] = useState(false)
  const [displayData, setDisplayData] = useState(funcoesData.items)
  const [urlToRequest] = useState<string>('api/services/app/Funcao')
  const [propsPagination, setPropsPagination] =
    useState<IPropsPagePaginationComponent>(
      funcoesData as IPropsPagePaginationComponent,
    )
  const isFirstRender = useRef(true)

  async function reloadFuncoesTable() {
    const response = await GetAllAsync<FuncoesFilterValues, IFuncoesProps>(
      filterData,
      urlToRequest,
    )
    setPropsPagination(response.result as IFuncoesProps)
    setFuncoesData(response.result as IFuncoesProps)
  }

  useEffect(() => {
    if (reloadTable) {
      reloadFuncoesTable()
      setReloadTable(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadTable])

  useEffect(() => {
    setDisplayData(funcoesData.items)
  }, [funcoesData])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    reloadFuncoesTable()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData])

  return (
    <div className="flex h-full flex-col">
      <div className="border-b-1 flex h-16 items-center justify-between gap-6 border-foreground bg-muted px-6 font-semibold text-foreground">
        <BreadcrumbComponent
          routes={[
            { displayRout: 'Cadastros', route: '' },
            { displayRout: 'Funcoes', route: '' },
          ]}
        />
        <span className="flex gap-4">
          <NewFuncoes
            setReloadTable={setReloadTable}
            typeRequest={'create'}
            urlToRequest={urlToRequest}
          />
          <FilterForm
            reloadFuncoesTable={reloadFuncoesTable}
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
                <TableHead className="w-[400px]">Nome</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[100px]">Default</TableHead>
                <TableHead className="w-[120px]">Criado Em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((data) => (
                <TableRow key={data.id} className="hover:bg-accent h-[30px]">
                  <TableCell className="w-[70px] text-center font-medium">
                    <NewFuncoes
                      setReloadTable={setReloadTable}
                      typeRequest={'update'}
                      dataId={data.id}
                      urlToRequest={urlToRequest}
                    />
                  </TableCell>
                  <TableCell className="w-[400px] font-medium">
                    {data.nome}
                  </TableCell>
                  <TableCell className="font-medium">
                    {data.displayName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {data.descricao}
                  </TableCell>
                  <TableCell className="w-[100px] justify-items-center font-medium">
                    {data.isDefault ? (
                      <BadgeCheck color="green"></BadgeCheck>
                    ) : (
                      <Badge color="gray"></Badge>
                    )}
                  </TableCell>
                  <TableCell className="w-[120px] font-medium">
                    {data.criadoEm
                      ? format(new Date(data.criadoEm), 'dd/MM/yyyy')
                      : '—'}
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
