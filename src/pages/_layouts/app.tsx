import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'

import { AppSidebar } from '@/components/App-sideBar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useTokenValidation } from '@/Hooks/useTokenValidation'

export function AppLayout() {
  useTokenValidation()

  return (
    <SidebarProvider style={{ height: '100dvh' }}>
      <div className="flex h-full w-full overflow-hidden antialiased bg-slate-50/30">
        <AppSidebar />

        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-4 lg:hidden shrink-0 z-10 sticky top-0">
            <SidebarTrigger>
              <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-white shadow-sm hover:bg-slate-50 transition-colors">
                <Menu size={20} className="text-slate-600" />
              </div>
            </SidebarTrigger>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-600 tracking-tight">FINTRACK</span>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
