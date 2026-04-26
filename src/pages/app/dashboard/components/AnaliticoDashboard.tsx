import Chart from 'react-apexcharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Timer, Zap, Users, MessageSquare } from 'lucide-react'

export function AnaliticoDashboard() {
    const lineOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'line',
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        colors: ['#8b5cf6', '#10b981'],
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
            labels: { style: { fontSize: '10px' } }
        },
        grid: { borderColor: '#f1f1f1' },
        legend: { position: 'top', fontSize: '11px' },
    }

    const lineSeries = [
        { name: 'Criados', data: [31, 40, 28, 51, 42, 60, 50] },
        { name: 'Resolvidos', data: [11, 32, 45, 32, 34, 52, 41] },
    ]

    const radarOptions: ApexCharts.ApexOptions = {
        chart: { type: 'radar', toolbar: { show: false } },
        labels: ['Vel.', 'Qual.', 'Proat.', 'Conh.', 'Comun.'],
        colors: ['#3b82f6'],
        fill: { opacity: 0.4 },
        markers: { size: 2 },
        yaxis: { show: false },
        xaxis: { labels: { style: { fontSize: '10px' } } }
    }

    const radarSeries = [{ name: 'Nível', data: [80, 50, 70, 40, 90] }]

    return (
        <div className="h-full flex flex-col p-4 gap-4 overflow-hidden">
            {/* Mini Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 shrink-0">
                <Card className="shadow-sm border-foreground/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">TMA</CardTitle>
                        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="text-xl font-bold">1h 45m</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-foreground/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">NPS</CardTitle>
                        <Zap className="h-3.5 w-3.5 text-purple-500" />
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="text-xl font-bold">9.2</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-foreground/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Online</CardTitle>
                        <Users className="h-3.5 w-3.5 text-blue-500" />
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="text-xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-foreground/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Interações</CardTitle>
                        <MessageSquare className="h-3.5 w-3.5 text-yellow-500" />
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="text-xl font-bold">+573</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts area */}
            <div className="flex-1 min-h-0 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 flex flex-col border-foreground/10 shadow-sm">
                    <CardHeader className="py-3">
                        <CardTitle className="text-sm">Fluxo de Chamados</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Chart options={lineOptions} series={lineSeries} type="line" height="100%" width="100%" />
                    </CardContent>
                </Card>
                <Card className="col-span-3 flex flex-col border-foreground/10 shadow-sm">
                    <CardHeader className="py-3">
                        <CardTitle className="text-sm">Skills do Time</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Chart options={radarOptions} series={radarSeries} type="radar" height="100%" width="100%" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
