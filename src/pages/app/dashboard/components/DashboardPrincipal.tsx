import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { IDashboardGeralDto } from '../interface'
import { TrendingUp, PieChart as PieChartIcon, ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import { api } from '@/lib/axios'

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899']

const STATUS_MAP: Record<string, string> = {
  1: 'Pendente',
  2: 'Concluído',
  3: 'Atrasado',
  4: 'Cancelado',
  5: 'Em Processamento',
}

const CATEGORIA_FINANCEIRA_MAP: Record<string, string> = {
  0: 'Despesas Fixas',
  1: 'Receitas',
  2: 'Investimentos',
  3: 'Lazer/Outros',
}

export function DashboardPrincipal() {
  const [data, setData] = useState<IDashboardGeralDto>({ evolucaoChamados: [], chamadosPorCategoria: [], chamadosPorUrgencia: [], chamadosPorPessoa: [] })

  const categoriasFormatadas = useMemo(() => {
    return data.chamadosPorCategoria?.map(item => ({
      ...item,
      indicador: CATEGORIA_FINANCEIRA_MAP[String(item.indicador)] || item.indicador
    })) || []
  }, [data.chamadosPorCategoria])

  const statusFormatado = useMemo(() => {
    return data.chamadosPorUrgencia?.map(item => ({
      ...item,
      indicador: STATUS_MAP[String(item.indicador)] || item.indicador
    })) || []
  }, [data.chamadosPorUrgencia])

  useEffect(() => {
    async function loadData() {
      const url = 'api/services/app/Dashboard/GetDashboardGraficos'
      const response = await api.get(
        `${url}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      )

      if (response.data.result) {
        setData(response.data.result)
      }
    }
    loadData()
  }, [])

  return (
    <div className="flex flex-col h-full gap-4 p-4 md:p-6 bg-slate-50/50">
      
      {/* Resumo de Cards Rápidos (Opcional, mas bom para Financeiro) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <Card className="border-emerald-500/20 bg-white shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <ArrowUpCircle size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Receitas Mensais</p>
              <h3 className="text-xl font-bold text-slate-900">R$ 12.450,00</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-white shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <ArrowDownCircle size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Despesas Mensais</p>
              <h3 className="text-xl font-bold text-slate-900">R$ 8.120,00</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 bg-white shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Saldo Atual</p>
              <h3 className="text-xl font-bold text-slate-900">R$ 4.330,00</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-6">
        {/* Linha 1: Evolução Financeira */}
        <div className="flex-[1.2] min-h-0">
          <Card className="h-full shadow-md flex flex-col border-emerald-100/50 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 shrink-0 pt-5 px-6 bg-emerald-50/30">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Fluxo de Caixa (Entradas x Saídas)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-4 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.evolucaoChamados} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    itemStyle={{ padding: '2px 0' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                  <Line type="monotone" name="Entradas" dataKey="abertos" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Saídas" dataKey="resolvidos" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Investido" dataKey="fechados" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Linha 2: Distribuição */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PieChart - Categorias Financeiras */}
          <Card className="shadow-md flex flex-col border-emerald-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0 pt-4 px-5 bg-emerald-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <PieChartIcon className="h-4 w-4 text-emerald-600" />
                Distribuição por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Pie data={categoriasFormatadas} innerRadius="60%" outerRadius="80%" paddingAngle={5} dataKey="valor" nameKey="indicador">
                    {categoriasFormatadas.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* PieChart - Status de Pagamento */}
          <Card className="shadow-md flex flex-col border-emerald-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0 pt-4 px-5 bg-emerald-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <PieChartIcon className="h-4 w-4 text-emerald-600" />
                Status de Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Pie data={statusFormatado} outerRadius="80%" paddingAngle={5} dataKey="valor" nameKey="indicador">
                    {statusFormatado.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Volume por Usuário/Dependente */}
          <Card className="shadow-md flex flex-col border-emerald-100/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0 pt-4 px-5 bg-emerald-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <PieChartIcon className="h-4 w-4 text-emerald-600" />
                Gastos por Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Pie data={data.chamadosPorPessoa} innerRadius="40%" outerRadius="80%" paddingAngle={5} dataKey="valor" nameKey="nome">
                    {data.chamadosPorPessoa.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

