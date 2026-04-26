import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Loader2,
  TrendingUp,
  Shield,
  BarChart3,
  Wallet,
  ArrowRight,
  X,
  Lock,
  Mail,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserData } from '@/context/userContext'
import { api } from '@/lib/axios'

import logoFintrack from '@/assets/logo_fintrack.png'

const signInForm = z.object({
  nomeUsuarioOuEmailAddress: z
    .string()
    .min(4, { message: 'O usuário/e-mail deve conter ao menos 4 caracteres' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve conter ao menos 6 caracteres' }),
})

type SignInForm = z.infer<typeof signInForm>

const features = [
  {
    icon: TrendingUp,
    title: 'Controle Total',
    desc: 'Acompanhe receitas, despesas e investimentos em tempo real.',
  },
  {
    icon: Shield,
    title: 'Segurança',
    desc: 'Seus dados financeiros protegidos com criptografia de ponta.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios',
    desc: 'Dashboards inteligentes para decisões mais assertivas.',
  },
  {
    icon: Wallet,
    title: 'Multi-Contas',
    desc: 'Gerencie todas as suas contas bancárias em um só lugar.',
  },
]

export function SignIn() {
  const { setToken, setUserId } = useUserData()
  const navigate = useNavigate()
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showLogin, setShowLogin] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>()

  async function handleSignIn(data: SignInForm) {
    const zodParse = signInForm.safeParse(data)
    if (!zodParse.success) {
      const error = zodParse.error
      let newErrors = {}
      for (const issue of error.issues) {
        newErrors = { ...newErrors, [issue.path[0]]: issue.message }
      }
      return setFormErrors(newErrors)
    } else {
      setFormErrors({})
      try {
        const response = await api.post('api/tokenauth/authenticate', data)
        localStorage.setItem('token', response.data.result.accessToken)
        setToken(response.data.result.accessToken)
        localStorage.setItem('userId', response.data.result.usuarioId)
        setUserId(response.data.result.usuarioId)
        localStorage.setItem(
          'expireTime',
          (
            1000 * parseInt(response.data.result.expireInSeconds) +
            Date.now()
          ).toString(),
        )
        toast.success('Bem vindo ao FinTrack!')
        navigate('/dashboard')
      } catch (e: any) {
        toast.error(
          e.response?.data?.error?.details ||
            e.response?.data?.error?.message ||
            'Erro ao realizar login',
        )
      }
    }
  }

  if (localStorage.getItem('token')) {
    return <Navigate to="/dashboard" />
  }

  return (
    <>
      <Helmet title="FinTrack — Gestão Financeira Inteligente" />

      <div className="relative min-h-screen w-full overflow-hidden bg-[#030d08]">
        {/* Animated Background Orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-20 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-15 blur-[100px]"
            style={{ background: 'radial-gradient(circle, #059669 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[80px]"
            style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
          <div className="flex items-center gap-3">
            <img src={logoFintrack} alt="FinTrack" className="h-10 w-auto drop-shadow-lg" draggable={false} />
          </div>
          <Button
            onClick={() => setShowLogin(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95"
            size="sm"
          >
            Acessar Sistema <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-20 md:pt-24 md:pb-32 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Plataforma Financeira
          </div>

          <h1 className="max-w-3xl text-4xl font-black text-white leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Suas finanças no{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              controle total
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-slate-400 leading-relaxed md:text-lg">
            Gerencie contas, movimentações e categorias com inteligência.
            Dashboards em tempo real para decisões financeiras mais assertivas.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              onClick={() => setShowLogin(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-5 rounded-2xl text-base shadow-2xl shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95"
            >
              Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <span className="text-xs text-slate-500">Acesso rápido e seguro</span>
          </div>

          {/* Stats Row */}
          <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
            {[
              { value: '100%', label: 'Seguro' },
              { value: '24/7', label: 'Disponível' },
              { value: 'Real-time', label: 'Dashboards' },
              { value: '∞', label: 'Contas' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-emerald-400 md:text-3xl">{stat.value}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="relative z-10 px-6 pb-24 md:px-12 lg:px-20">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-emerald-500/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.06]"
              >
                <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-400 transition-transform group-hover:scale-110">
                  <f.icon size={22} />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-white">{f.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-emerald-900/20 py-6 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} FinTrack. Todos os direitos reservados.
        </footer>

        {/* Login Modal Overlay */}
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowLogin(false)}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl border border-emerald-500/15 bg-[#071a10]/95 p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 fade-in duration-300">
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 rounded-full p-1.5 text-slate-500 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img src={logoFintrack} alt="FinTrack" className="h-12 w-auto drop-shadow-lg" draggable={false} />
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-white">Bem-vindo de volta</h2>
                <p className="mt-1 text-xs text-slate-500">Entre com suas credenciais para continuar</p>
              </div>

              <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="nomeUsuarioOuEmailAddress">
                    Usuário ou E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="nomeUsuarioOuEmailAddress"
                      type="text"
                      className="pl-10 border-emerald-900/30 bg-white/5 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-10"
                      placeholder="Digite seu usuário..."
                      {...register('nomeUsuarioOuEmailAddress')}
                    />
                  </div>
                  {formErrors.nomeUsuarioOuEmailAddress && (
                    <p className="text-xs font-medium text-red-400">{formErrors.nomeUsuarioOuEmailAddress}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="password">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10 border-emerald-900/30 bg-white/5 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-10"
                      placeholder="••••••••"
                      {...register('password')}
                    />
                  </div>
                  {formErrors.password && (
                    <p className="text-xs font-medium text-red-400">{formErrors.password}</p>
                  )}
                </div>

                <Button
                  disabled={isSubmitting}
                  className="mt-2 w-full font-bold rounded-xl h-11 shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                  type="submit"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Entrar no Sistema
                </Button>
              </form>

              <div className="mt-5 text-center text-[10px] text-slate-600">
                Acesso restrito a usuários autorizados
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}