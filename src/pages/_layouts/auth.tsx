import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background antialiased relative overflow-hidden">
      <Outlet />
    </div>
  )
}
