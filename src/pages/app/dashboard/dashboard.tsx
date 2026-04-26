import { BreadcrumbComponent } from '@/components/breadcrumb'
import { Helmet } from 'react-helmet-async'
import { DashboardPrincipal } from './components/DashboardPrincipal'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard Geral" />
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header / Top Bar */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-foreground/10 bg-muted px-6 font-semibold text-foreground">
          <BreadcrumbComponent routes={[{ displayRout: 'Dashboard', route: '' }]} />
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 min-h-0 bg-background overflow-auto">
          <DashboardPrincipal />
        </div>
      </div>
    </>
  )
}
