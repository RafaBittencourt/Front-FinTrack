import Chart from 'react-apexcharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Headset, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export function ClienteDashboard() {
    // Configuração do gráfico de Módulos (Antiga Categoria)
    const moduleOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
                barHeight: '60%',
            },
        },
        colors: ['#3b82f6'],
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['Fiscal', 'Contábil', 'Folha'],
            labels: { style: { fontSize: '10px' } }
        },
        yaxis: {
            labels: { style: { fontSize: '10px' } }
        },
        grid: { borderColor: '#f1f1f1', strokeDashArray: 4 },
    }

    const moduleSeries = [{ name: 'Chamados', data: [32, 25, 18] }]

    // Configuração do gráfico de Evolução Mensal (Inspirado na imagem)
    const evolutionOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            sparkline: { enabled: false },
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            }
        },
        colors: ['#3b82f6', '#f59e0b'], // Azul e Laranja para bater com a imagem
        dataLabels: {
            enabled: true,
            style: { fontSize: '9px', colors: ['#3b82f6', '#f59e0b'] },
            background: { enabled: false },
            offsetY: -5
        },
        xaxis: {
            categories: ['2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01'],
            labels: { style: { fontSize: '10px' } }
        },
        yaxis: {
            show: false,
        },
        grid: {
            borderColor: '#f1f1f1',
            strokeDashArray: 4,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '11px',
        },
        markers: {
            size: 4,
            strokeWidth: 2,
        }
    }

    const evolutionSeries = [
        {
            name: 'Chamados Abertos',
            data: [85, 94, 91, 98, 146, 137, 109, 162]
        },
        {
            name: 'Chamados Resolvidos',
            data: [68, 72, 72, 85, 164, 161, 143, 151]
        }
    ]

    return (
        <div className="h-full flex flex-col p-4 gap-4 overflow-hidden">
            {/* Mini Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 shrink-0">
                <Card className="shadow-sm border-foreground/10 bg-background/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total de Chamados</CardTitle>
                        <Headset className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent className="pb-3 text-center lg:text-left">
                        <div className="text-2xl font-bold">124</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-foreground/10 bg-background/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Resolvidos</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent className="pb-3 text-center lg:text-left">
                        <div className="text-2xl font-bold">85</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-foreground/10 bg-background/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Abertos</CardTitle>
                        <Clock className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent className="pb-3 text-center lg:text-left">
                        <div className="text-2xl font-bold">39</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-foreground/10 bg-background/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pendentes</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent className="pb-3 text-center lg:text-left">
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="flex-1 min-h-0 grid gap-4 grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* Gráfico de Evolução (Inspirado na imagem) */}
                <Card className="lg:col-span-8 flex flex-col border-foreground/10 shadow-sm bg-background/50">
                    <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">Evolução de Chamados (Abertos vs Resolvidos)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 p-0 pr-2">
                        <Chart options={evolutionOptions} series={evolutionSeries} type="area" height="100%" width="100%" />
                    </CardContent>
                </Card>

                {/* Gráfico de Módulos */}
                <Card className="lg:col-span-4 flex flex-col border-foreground/10 shadow-sm bg-background/50">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm font-semibold">Chamados por Módulo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 px-2 pb-2">
                        <Chart options={moduleOptions} series={moduleSeries} type="bar" height="100%" width="100%" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
