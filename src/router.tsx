import { createBrowserRouter, Navigate, redirect } from 'react-router-dom'

import { getUser } from './Hooks/useToken'
import { pageLoader } from './pageLoaders'
import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { Configuracoes } from './pages/app/Configuracoes/Configurcao/configuracoes'
import { Funcoes } from './pages/app/Configuracoes/funcoes/funcoes'
import { Usuarios } from './pages/app/Configuracoes/Usuarios/usuarios'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { SignIn } from './pages/auth/sign-in'
import { ProtectedRoute } from './ProtectedRoute'
import { Contas } from './pages/app/Cadastros/Contas/contas'

const loader = async () => {
  const user = await getUser()
  if (!user) {
    localStorage.clear()
    return redirect('/sign-in')
  }
  return null
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    loader,
    errorElement: <Navigate to="/" />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/financeiro/movimentacoes',
        element: <Dashboard />, // Placeholder or specific component if exists
      },
      {
        path: '/financeiro/contas',
        element: <Contas />,
        loader: () => pageLoader(`api/services/app/FinTrackAccount/GetAll`),
      },
      // {
      //   path: '/cadastro/categorias',
      //   element: (
      //     <ProtectedRoute permission={["Support.Cadastro.Modulo.Criar", "Support.Cadastro.Modulo.Atualizar"]}>
      //       <Modulos />
      //     </ProtectedRoute>
      //   ),
      //   loader: () => pageLoader(`api/services/app/Modulo/GetAll`),
      // },
      // {
      //   path: '/cadastro/centros-custo',
      //   element: (
      //     <ProtectedRoute permission={["Support.Cadastro.Versionamento.Criar", "Support.Cadastro.Versionamento.Atualizar"]}>
      //       <Versionamentos />
      //     </ProtectedRoute>
      //   ),
      //   loader: () => pageLoader(`api/services/app/Versionamento/GetAll`),
      // },
      {
        path: '/configuracoes/usuarios',
        element: (
          <ProtectedRoute permission={["Support.Configuracao.Usuario.Criar", "Support.Configuracao.Usuario.Atualizar"]}>
            <Usuarios />
          </ProtectedRoute>
        ),
        loader: () => pageLoader(`api/services/app/Usuario/GetAll`),
      },
      {
        path: '/configuracoes/funcoes',
        element: (
          <ProtectedRoute permission={["Support.Configuracao.Funcao.Criar", "Support.Configuracao.Funcao.Atualizar"]}>
            <Funcoes />
          </ProtectedRoute>
        ),
        loader: () => pageLoader(`api/services/app/Funcao/GetAll`),
      },
      {
        path: '/configuracoes/empresa',
        element: (
          <ProtectedRoute permission="Support.Configuracao.Configuracao">
            <Configuracoes />
          </ProtectedRoute>
        ),
        loader: () => pageLoader(`api/services/app/Funcao/GetAll`),
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [{ path: '/sign-in', element: <SignIn /> }],
  },
])
