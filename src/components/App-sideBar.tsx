import {
  ArrowRightLeft,
  BookOpenText,
  Building2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Receipt,
  // Settings,
  User,
  Users,
  Wallet
} from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { useUserData } from '@/context/userContext'
import { IResponseRequestError } from '@/lib/interface'
import { cn } from '@/lib/utils'

import logo from '../assets/logo_fintrack.png'
import { NavLink } from './nav-link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface SubmenuItem {
  name: string
  path: string
  permission?: string | string[]
}

interface MenuItem {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any
  path: string
  submenu?: SubmenuItem[]
  permission?: string | string[]
}

interface MenuCategory {
  name: string
  menu: MenuItem[]
}

function avatarUrlFromSeed(seed: string) {
  const name = seed.trim() || 'FinTrack'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.slice(0, 64))}&background=047857&color=f0fdf4&size=128&bold=true`
}

export function AppSidebar() {
  const {
    setToken,
    nomeUsuario,
    emailUsuario,
    loginUsuario,
    profileUrl,
    checkPermission,
  } = useUserData()
  const navigate = useNavigate()

  const profileAvatarSrc = useMemo(() => {
    const fromApi = profileUrl?.trim()
    if (fromApi) return fromApi
    return avatarUrlFromSeed(nomeUsuario || loginUsuario || emailUsuario || '')
  }, [profileUrl, nomeUsuario, loginUsuario, emailUsuario])

  const linhaSecundaria = emailUsuario || loginUsuario || ''

  const menuItems: MenuCategory[] = [
    {
      name: 'Resumo Geral',
      menu: [
        {
          name: 'Dashboard',
          icon: LayoutDashboard,
          path: '/dashboard',
        },
      ],
    },
    {
      name: 'Financeiro',
      menu: [
        {
          name: 'Movimentações',
          icon: ArrowRightLeft,
          path: '/financeiro/movimentacoes',
        },
        {
          name: 'Contas',
          icon: Wallet,
          path: '/financeiro/contas',
        },
      ],
    },
    {
      name: 'Cadastros',
      menu: [
        {
          name: 'Parametrização',
          icon: Receipt,
          path: '',
          submenu: [
            {
              name: 'Categorias',
              path: '/cadastro/categorias',
              permission: ['Support.Cadastro.Modulo.Criar', 'Support.Cadastro.Modulo.Atualizar'],
            },
            {
              name: 'Centros de Custo',
              path: '/cadastro/centros-custo',
              permission: ['Support.Cadastro.Versionamento.Criar', 'Support.Cadastro.Versionamento.Atualizar'],
            },
          ],
        },
      ],
    },
    {
      name: 'Configurações',
      menu: [
        {
          name: 'Minha Empresa',
          path: '/configuracoes/empresa',
          icon: Building2,
          permission: ['Support.Configuracao.Empresa.Criar', 'Support.Configuracao.Empresa.Atualizar'],
        },
        {
          name: 'Usuários',
          path: '/configuracoes/usuarios',
          icon: User,
          permission: ['Support.Configuracao.Usuario.Criar', 'Support.Configuracao.Usuario.Atualizar'],
        },
        {
          name: 'Grupos de Acesso',
          path: '/configuracoes/gruposUsuarios',
          icon: Users,
          permission: ['Support.Configuracao.GrupoUsuario.Criar', 'Support.Configuracao.GrupoUsuario.Atualizar'],
        },
        {
          name: 'Permissões',
          path: '/configuracoes/funcoes',
          icon: BookOpenText,
          permission: ['Support.Configuracao.Funcao.Criar', 'Support.Configuracao.Funcao.Atualizar'],
        },
      ],
    },
  ]

  const filteredMenuItems = menuItems
    .map((group) => {
      const filteredMenu = group.menu
        .map((item) => {
          if (item.submenu) {
            const filteredSubmenu = item.submenu.filter((sub) =>
              sub.permission ? checkPermission(sub.permission) : true,
            )
            return { ...item, submenu: filteredSubmenu }
          }
          return item
        })
        .filter((item) => {
          if (item.submenu) {
            return item.submenu.length > 0
          }
          return item.permission ? checkPermission(item.permission) : true
        })

      return { ...group, menu: filteredMenu }
    })
    .filter((group) => group.menu.length > 0)

  async function logOut() {
    try {
      localStorage.clear()
      setToken(null)
      navigate('/sign-in')
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'response' in e) {
        const error = e as IResponseRequestError
        return {
          success: error.response.data.success,
          message: error.response.data.error.message,
        }
      } else {
        return {
          success: false,
          message: 'An unexpected error occurred.',
        }
      }
    }
  }

  const useKeyboardShortcuts = () => {
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'l') {
          logOut()
        }
        if (event.ctrlKey && event.key === 'p') {
          event.preventDefault()
          console.log('ctrl + p')
        }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }, [])
  }

  useKeyboardShortcuts()

  return (
    <Sidebar className="w-64">
      <SidebarHeader>
        <div className="mx-auto flex h-[80px] w-full items-center justify-center p-4">
          <img
            src={logo}
            alt="FinTrack Logo"
            className="h-full w-full object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-105"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {filteredMenuItems.map((group) => (
          <SidebarGroup key={group.name} className="py-2">
            <SidebarGroupLabel className="text-emerald-500/60 font-bold uppercase text-[10px] tracking-widest px-4 mb-2">
              {group.name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.menu.map((item) =>
                  item.submenu ? (
                    <Collapsible key={item.name} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="flex items-center justify-between gap-3 px-4 py-2 text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
                            <div className="flex items-center gap-3">
                              {item.icon && <item.icon size={18} className="text-emerald-500" />}
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <ChevronRight
                              size={16}
                              className={cn(
                                'transition-transform duration-200 group-data-[state=closed]/collapsible:rotate-0 group-data-[state=open]/collapsible:rotate-90',
                              )}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-7 border-l border-emerald-500/20 py-1">
                            {item.submenu.map((children: any) => (
                              <SidebarMenuSubItem key={children.name}>
                                <SidebarMenuButton asChild className="text-slate-400 hover:text-emerald-400">
                                  <NavLink to={children.path}>
                                    <span>{children.name}</span>
                                  </NavLink>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild className="px-4 py-2 text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
                        <NavLink to={item.path} className="flex items-center gap-3 w-full">
                          {item.icon && <item.icon size={18} className="text-emerald-500" />}
                          <span className="font-medium">{item.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-emerald-900/30 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left outline-none ring-sidebar-ring transition-all duration-300 hover:bg-emerald-500/10 focus-visible:ring-2"
            >
              <Avatar className="h-10 w-10 shrink-0 rounded-md border border-emerald-500/20">
                <AvatarImage
                  src={profileAvatarSrc}
                  alt=""
                  className="h-full w-full rounded-md object-cover"
                />
                <AvatarFallback className="rounded-md bg-emerald-600 text-sm font-bold text-white">
                  {(nomeUsuario || loginUsuario || 'FT').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 overflow-hidden">
                <span className="truncate text-[13px] font-semibold text-slate-100">
                  {nomeUsuario || loginUsuario || 'Utilizador'}
                </span>
                {linhaSecundaria ? (
                  <span
                    className="truncate text-[11px] text-slate-400"
                    title={linhaSecundaria}
                  >
                    {linhaSecundaria}
                  </span>
                ) : null}
                <span className="truncate text-[10px] font-medium tracking-tight text-emerald-500/80">
                  FinTrack · Premium
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56 bg-slate-900 border-emerald-900/50 text-slate-200">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none text-slate-100">
                  {nomeUsuario || loginUsuario}
                </p>
                {emailUsuario ? (
                  <p className="truncate text-xs leading-none text-slate-400" title={emailUsuario}>
                    {emailUsuario}
                  </p>
                ) : null}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-emerald-900/30" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-emerald-500/10 hover:text-emerald-400">
                Meu Perfil
                <DropdownMenuShortcut>ctrl+p</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-emerald-500/10 hover:text-emerald-400">
                Alterar Senha
                <DropdownMenuShortcut>ctrl+t</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-emerald-500/10 hover:text-emerald-400">
                Preferências
                <DropdownMenuShortcut>ctrl+c</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-emerald-900/30" />
            <DropdownMenuItem onClick={logOut} className="text-red-400 hover:bg-red-500/10 hover:text-red-500">
              Sair da Conta
              <DropdownMenuShortcut>
                <LogOut size={14} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

