import { useEffect, useRef, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { 
  Landmark, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  LayoutGrid,
  CreditCard,
  Plus,
  Filter
} from 'lucide-react'

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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { ContaForm } from './contaForm'
import { FilterForm } from './filterForm'
import { ContasFilterValues, IContasProps } from './interface'

/**
 * PADRÃO DE TELA FINTRACK:
 * Este componente serve como base para todas as telas de listagem (CRUD).
 * Estrutura: Header (Breadcrumb + Ações) -> Content (Desktop: Table / Mobile: Cards) -> Footer (Pagination)
 */

export function Contas() {
  const contas = useLoaderData() as IContasProps
  const [contasData, setContasData] = useState(contas)
  const [filterData, setFilterData] = useState<ContasFilterValues>(
    {
      pageNumber: 1,
      maxResultCount: 10, // Alinhado com a mudança do usuário no componente de paginação
    } as ContasFilterValues,
  )
  const [reloadTable, setReloadTable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [displayData, setDisplayData] = useState(contasData.items)
  const [urlToRequest] = useState<string>('api/services/app/FinTrackAccount')
  const [propsPagination, setPropsPagination] =
    useState<IPropsPagePaginationComponent>(
      contasData as IPropsPagePaginationComponent,
    )
  const isFirstRender = useRef(true)

  async function reloadContas() {
    setIsLoading(true)
    try {
      const response = await GetAllAsync<ContasFilterValues, IContasProps>(filterData, urlToRequest)
      setPropsPagination(response.result as IContasProps)
      setContasData(response.result as IContasProps)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (reloadTable) {
      reloadContas()
      setReloadTable(false)
    }
  }, [reloadTable])

  useEffect(() => {
    setDisplayData(contasData.items)
  }, [contasData])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    reloadContas()
  }, [filterData])

  // Helpers de Visualização (Mapeamento de Enums)
  const getAccountTypeLabel = (type: number) => {
    switch (type) {
      case 0: return 'Conta Corrente'
      case 1: return 'Poupança'
      case 2: return 'Caixa (Dinheiro)'
      case 3: return 'Carteira'
      default: return 'Outros'
    }
  }

  const getAccountIcon = (type: number) => {
    const iconClass = "text-emerald-500 transition-transform group-hover:scale-110"
    switch (type) {
      case 0: return <Landmark size={16} className={iconClass} />
      case 1: return <TrendingUp size={16} className={iconClass} />
      case 2: return <Wallet size={16} className={iconClass} />
      case 3: return <CreditCard size={16} className={iconClass} />
      default: return <Landmark size={16} className={iconClass} />
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      
      {/* 1. HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 md:px-8 md:py-4 bg-white border-b border-emerald-900/5 shadow-sm">
        <div className="flex flex-col gap-1 text-left animate-in fade-in slide-in-from-left-4">
          <BreadcrumbComponent
            routes={[
              { displayRout: 'Financeiro', route: '' },
              { displayRout: 'Contas Bancárias', route: '' },
            ]}
          />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight hidden md:block">
            Contas Bancárias
          </h1>
          <h1 className="text-lg font-bold text-slate-900 md:hidden">
            Contas Bancárias
          </h1>
        </div>

        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
          <ContaForm
            setReloadTable={setReloadTable}
            typeRequest={'create'}
            urlToRequest={urlToRequest}
          />
          <FilterForm
            reloadTable={reloadContas}
            setFilterData={setFilterData}
          />
        </div>
      </div>

      {/* 2. CONTEÚDO PRINCIPAL (TABELA / CARDS) */}
      <div className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6 space-y-4">
        
        {/* VIEW: Desktop (Table) */}
        <div className="hidden md:block transition-all duration-500 ease-in-out">
          <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-900/5 overflow-hidden max-w-[1400px] mx-auto">
            <Table>
              <TableHeader className="bg-slate-50/40">
                <TableRow className="hover:bg-transparent border-emerald-900/5 h-12">
                  <TableHead className="w-[100px] text-center font-black text-slate-400 uppercase text-[10px] tracking-widest">Opções</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-left">Instituição</TableHead>
                  <TableHead className="w-[200px] font-black text-slate-400 uppercase text-[10px] tracking-widest text-left">Categoria / Tipo</TableHead>
                  <TableHead className="w-[220px] font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Saldo Consolidado</TableHead>
                  <TableHead className="w-[150px] font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="h-12">
                      <TableCell><Skeleton className="h-6 w-6 rounded-full mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full mx-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : displayData && displayData.length > 0 ? (
                  displayData.map((data) => (
                    <TableRow key={data.id} className="hover:bg-emerald-50/30 transition-all border-emerald-900/5 group h-12 cursor-default">
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                          <ContaForm
                            setReloadTable={setReloadTable}
                            typeRequest={'update'}
                            dataId={data.id}
                            urlToRequest={urlToRequest}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-1.5 h-5 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                          <span className="font-bold text-slate-800 text-sm">{data.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-left font-semibold text-slate-500">
                        <div className="flex items-center gap-2">
                          {getAccountIcon(data.type)}
                          <span className="text-[10px] uppercase tracking-tight">{getAccountTypeLabel(data.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-black tabular-nums text-emerald-800 text-base">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.balance)}
                      </TableCell>
                      <TableCell className="text-center">
                        {data.isActive ? (
                          <Badge variant="outline" className="bg-emerald-100/40 text-emerald-700 border-emerald-300 gap-1 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-tighter">
                            <CheckCircle2 size={12} className="animate-pulse" /> Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-100 text-slate-400 border-slate-200 gap-1 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-tighter">
                            <XCircle size={12} /> Inativo
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-60 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-300 animate-in zoom-in-95 duration-500">
                        <div className="p-5 bg-slate-50 rounded-full">
                          <LayoutGrid size={48} />
                        </div>
                        <p className="font-bold text-slate-400 text-base">Nenhuma conta encontrada nesta busca.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* VIEW: Mobile (Cards) */}
        <div className="md:hidden flex flex-col gap-4">
          {isLoading ? (
             Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-xl border-emerald-900/5 h-28">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex flex-col gap-2 flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))
          ) : displayData && displayData.length > 0 ? (
            displayData.map((data) => (
              <Card key={data.id} className="rounded-xl border-emerald-900/5 shadow-lg overflow-hidden active:scale-[0.98] transition-transform border-l-4" style={{ borderLeftColor: data.color }}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/20"
                        style={{ backgroundColor: data.color }}
                      >
                        {getAccountIcon(data.type).props.children || getAccountIcon(data.type)}
                      </div>
                      <div className="flex flex-col text-left">
                        <h3 className="font-black text-slate-950 text-sm leading-none mb-1">{data.name}</h3>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-80">
                          {getAccountTypeLabel(data.type)}
                        </span>
                      </div>
                    </div>
                    <ContaForm
                      setReloadTable={setReloadTable}
                      typeRequest={'update'}
                      dataId={data.id}
                      urlToRequest={urlToRequest}
                    />
                  </div>

                  <div className="flex justify-between items-end bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Saldo Atual</span>
                      <span className="text-xl font-black text-emerald-800 tabular-nums leading-none">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.balance)}
                      </span>
                    </div>
                    {data.isActive ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full uppercase">
                        <CheckCircle2 size={12} /> Ativo
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
                        <XCircle size={12} /> Inativo
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
               <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-slate-50 rounded-full mb-2">
                  <LayoutGrid className="text-slate-300" size={32} />
                </div>
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Nenhuma conta cadastrada.</span>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. PAGINAÇÃO (STICKY) */}
      <div className="fixed bottom-0 left-0 right-0 md:relative bg-white border-t border-slate-100 z-50">
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

