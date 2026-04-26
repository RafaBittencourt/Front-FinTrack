import './global.css'

import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { DataProvider } from './context/userContext'
import { router } from './router'

export function App() {
  return (
    <HelmetProvider>
      <DataProvider>
        <Helmet titleTemplate="%s | FinTrack" />
        <Toaster richColors />
        <RouterProvider router={router} />
      </DataProvider>
    </HelmetProvider>
  )
}
