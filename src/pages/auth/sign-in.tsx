import { useCallback, useEffect, useRef, useState } from 'react'
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
  User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserData } from '@/context/userContext'
import { api } from '@/lib/axios'
import { fetchGoogleWebClientId } from '@/lib/fintrackGoogleConfig'
import {
  parseFinTrackAuthResponse,
  persistFinTrackAuth,
  type FinTrackAuthResponse,
} from '@/lib/fintrackSession'

import logoFintrack from '@/assets/logo_fintrack.png'

const signInSchema = z.object({
  login: z
    .string()
    .min(1, { message: 'Informe o utilizador ou e-mail' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
})

const signUpSchema = z.object({
  login: z.string().min(2, { message: 'Login mínimo 2 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  senha: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
  nomeExibicao: z.string().optional(),
})

type SignInForm = z.infer<typeof signInSchema>
type SignUpForm = z.infer<typeof signUpSchema>

function mensagemErroApi(e: unknown): string {
  const err = e as {
    response?: { data?: { message?: string; title?: string; detail?: string } }
  }
  const d = err.response?.data
  if (d && typeof d.message === 'string') return d.message
  if (d && typeof d.detail === 'string') return d.detail
  if (d && typeof d.title === 'string') return d.title
  return 'Erro ao comunicar com o servidor.'
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

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
  const [formErrorsSignIn, setFormErrorsSignIn] = useState<Record<string, string>>({})
  const [formErrorsSignUp, setFormErrorsSignUp] = useState<Record<string, string>>({})
  const [showLogin, setShowLogin] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const googleBtnMountRef = useRef<HTMLDivElement>(null)

  const [googleWebClientId, setGoogleWebClientId] = useState('')
  const [googleConfigLoading, setGoogleConfigLoading] = useState(true)

  const signInForm = useForm<SignInForm>()
  const signUpForm = useForm<SignUpForm>()

  const aplicarSessao = useCallback(
    (data: FinTrackAuthResponse) => {
      persistFinTrackAuth(data)
      setToken(data.accessToken)
      setUserId(data.usuario.id)
    },
    [setToken, setUserId],
  )

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const cid = await fetchGoogleWebClientId()
          if (!cancelled && cid) setGoogleWebClientId(cid)
        } catch {
          // API indisponível ou Google não configurado no servidor
        } finally {
          if (!cancelled) setGoogleConfigLoading(false)
        }
      })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleGoogleCredential = useCallback(
    async (response: { credential: string }) => {
      try {
        const res = await api.post<unknown>('api/fin-track/auth/google', {
          idToken: response.credential,
        })
        const payload = parseFinTrackAuthResponse(res.data)
        if (!payload) {
          toast.error('Sessão inválida.')
          return
        }
        aplicarSessao(payload)
        toast.success(
          `Bem-vindo, ${payload.usuario.nomeExibicao || payload.usuario.login}!`,
        )
        setShowLogin(false)
        navigate('/dashboard')
      } catch (e: unknown) {
        toast.error(mensagemErroApi(e))
      }
    },
    [aplicarSessao, navigate],
  )

  useEffect(() => {
    if (!showLogin || !googleWebClientId || !googleBtnMountRef.current) return

    const el = googleBtnMountRef.current
    let cancelled = false

    const mountGoogle = () => {
      if (cancelled || !window.google?.accounts?.id) return
      window.google.accounts.id.initialize({
        client_id: googleWebClientId,
        callback: handleGoogleCredential,
      })
      el.innerHTML = ''
      window.google.accounts.id.renderButton(el, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        width: el.offsetWidth || 280,
      })
    }

    if (window.google?.accounts?.id) {
      mountGoogle()
      return () => {
        cancelled = true
        window.google?.accounts.id.cancel()
        el.innerHTML = ''
      }
    }

    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    ) as HTMLScriptElement | null

    if (existing) {
      if (window.google?.accounts?.id) mountGoogle()
      else existing.addEventListener('load', mountGoogle)
      return () => {
        cancelled = true
        window.google?.accounts.id.cancel()
        el.innerHTML = ''
      }
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => mountGoogle()
    document.body.appendChild(script)

    return () => {
      cancelled = true
      window.google?.accounts.id.cancel()
      el.innerHTML = ''
    }
  }, [showLogin, googleWebClientId, handleGoogleCredential])

  async function handleSignIn(data: SignInForm) {
    const parsed = signInSchema.safeParse(data)
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0])
        next[k] = issue.message
      }
      setFormErrorsSignIn(next)
      return
    }
    setFormErrorsSignIn({})
    try {
      const res = await api.post<unknown>('api/fin-track/auth/signin', {
        login: data.login.trim(),
        senha: data.senha,
      })
      const payload = parseFinTrackAuthResponse(res.data)
      if (!payload) {
        toast.error('Sessão inválida.')
        return
      }
      aplicarSessao(payload)
      toast.success('Bem-vindo ao FinTrack!')
      setShowLogin(false)
      navigate('/dashboard')
    } catch (e: unknown) {
      toast.error(mensagemErroApi(e))
    }
  }

  async function handleSignUp(data: SignUpForm) {
    const parsed = signUpSchema.safeParse(data)
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0])
        next[k] = issue.message
      }
      setFormErrorsSignUp(next)
      return
    }
    setFormErrorsSignUp({})
    try {
      const body: Record<string, unknown> = {
        login: data.login.trim(),
        email: data.email.trim(),
        senha: data.senha,
      }
      const nome = data.nomeExibicao?.trim()
      if (nome) body.nomeExibicao = nome

      const res = await api.post<unknown>('api/fin-track/auth/signup', body)
      const payload = parseFinTrackAuthResponse(res.data)
      if (!payload) {
        toast.error('Sessão inválida.')
        return
      }
      aplicarSessao(payload)
      toast.success('Conta criada com sucesso!')
      setShowLogin(false)
      navigate('/dashboard')
    } catch (e: unknown) {
      toast.error(mensagemErroApi(e))
    }
  }

  if (localStorage.getItem('token')) {
    return <Navigate to="/dashboard" />
  }

  return (
    <>
      <Helmet title="FinTrack — Gestão Financeira Inteligente" />

      <div className="relative min-h-screen w-full overflow-hidden bg-[#030d08]">
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

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <nav className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-5 md:px-12 lg:px-20">
          <div className="flex items-center gap-3">
            <img src={logoFintrack} alt="FinTrack" className="h-10 w-auto drop-shadow-lg" draggable={false} />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setAuthMode('signin')
                setShowLogin(true)
              }}
              className="border-white/20 bg-white/5 font-bold text-white hover:bg-white/10 hover:text-white"
            >
              <GoogleGlyph className="mr-2 h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Entrar com Google</span>
              <span className="sm:hidden">Google</span>
            </Button>
            <Button
              type="button"
              onClick={() => {
                setAuthMode('signin')
                setShowLogin(true)
              }}
              className="bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500"
              size="sm"
            >
              Acessar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </nav>

        <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-20 md:pt-24 md:pb-32 text-center">


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

          <div className="mt-10 flex w-full max-w-lg flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAuthMode('signin')
                setShowLogin(true)
              }}
              className="order-2 border-white/20 bg-white/5 px-8 py-5 text-base font-bold text-white hover:bg-white/10 hover:text-white sm:order-1"
            >
              <GoogleGlyph className="mr-3 h-5 w-5 shrink-0" />
              Continuar com Google
            </Button>
            <Button
              type="button"
              onClick={() => {
                setAuthMode('signup')
                setShowLogin(true)
              }}
              className="order-1 bg-emerald-600 px-8 py-5 text-base font-bold text-white shadow-2xl shadow-emerald-900/40 hover:bg-emerald-500 sm:order-2"
            >
              Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

          </div>

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

        <footer className="relative z-10 border-t border-emerald-900/20 py-6 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} FinTrack. Todos os direitos reservados.
        </footer>

        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
              onClick={() => setShowLogin(false)}
            />

            <div className="relative z-10 w-full max-w-[420px] transform overflow-hidden rounded-[24px] border border-white/10 bg-[#0a120f] shadow-premium backdrop-blur-xl transition-all sm:my-8 animate-in zoom-in-95 fade-in duration-300">
              
              {/* Decorative top glow */}
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />
              <div className="absolute left-1/2 top-0 h-[100px] w-[300px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[60px]" />

              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              <div className="p-8">
                <div className="mb-6 flex justify-center">
                  <img src={logoFintrack} alt="FinTrack" className="h-10 w-auto drop-shadow-md" draggable={false} />
                </div>

                {/* Switcher */}
                <div className="relative mb-8 flex w-full rounded-xl bg-black/50 p-1">
                  <div
                    className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-lg bg-emerald-500 shadow-sm transition-all duration-300 ease-out ${
                      authMode === 'signin' ? 'left-1' : 'left-[calc(50%+3px)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin')
                      setFormErrorsSignIn({})
                      setFormErrorsSignUp({})
                    }}
                    className={`relative z-10 flex-1 rounded-lg py-2 text-sm font-semibold transition-colors duration-300 ${
                      authMode === 'signin' ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup')
                      setFormErrorsSignIn({})
                      setFormErrorsSignUp({})
                    }}
                    className={`relative z-10 flex-1 rounded-lg py-2 text-sm font-semibold transition-colors duration-300 ${
                      authMode === 'signup' ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Criar conta
                  </button>
                </div>

                <div className="relative overflow-hidden transition-all duration-500">
                  {authMode === 'signin' ? (
                    <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-slate-300" htmlFor="login">
                          E-mail ou Utilizador
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <Input
                            id="login"
                            className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                            placeholder="seu@email.com"
                            {...signInForm.register('login')}
                          />
                        </div>
                        {formErrorsSignIn.login && (
                          <p className="text-xs text-red-400">{formErrorsSignIn.login}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold text-slate-300" htmlFor="senha">
                            Senha
                          </Label>
                          <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline">
                            Esqueceu?
                          </a>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <Input
                            id="senha"
                            type="password"
                            className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                            placeholder="••••••••"
                            {...signInForm.register('senha')}
                          />
                        </div>
                        {formErrorsSignIn.senha && (
                          <p className="text-xs text-red-400">{formErrorsSignIn.senha}</p>
                        )}
                      </div>

                      <Button
                        disabled={signInForm.formState.isSubmitting}
                        className="mt-2 h-12 w-full bg-emerald-600 font-semibold text-white shadow-premium hover:bg-emerald-500 transition-all"
                        type="submit"
                      >
                        {signInForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Entrar na plataforma
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-slate-300" htmlFor="su-login">
                          Utilizador
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <Input
                            id="su-login"
                            placeholder="Seu @usuário"
                            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                            {...signUpForm.register('login')}
                          />
                        </div>
                        {formErrorsSignUp.login && (
                          <p className="text-xs text-red-400">{formErrorsSignUp.login}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-slate-300" htmlFor="su-email">
                          E-mail
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <Input
                            id="su-email"
                            type="email"
                            placeholder="seu@email.com"
                            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                            {...signUpForm.register('email')}
                          />
                        </div>
                        {formErrorsSignUp.email && (
                          <p className="text-xs text-red-400">{formErrorsSignUp.email}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-slate-300" htmlFor="su-nome">
                          Nome (opcional)
                        </Label>
                        <Input
                          id="su-nome"
                          className="h-11 border-white/10 bg-white/5 text-white focus:border-emerald-500/50 focus:ring-emerald-500/20"
                          {...signUpForm.register('nomeExibicao')}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-slate-300" htmlFor="su-senha">
                          Senha
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <Input
                            id="su-senha"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                            {...signUpForm.register('senha')}
                          />
                        </div>
                        {formErrorsSignUp.senha && (
                          <p className="text-xs text-red-400">{formErrorsSignUp.senha}</p>
                        )}
                      </div>

                      <Button
                        disabled={signUpForm.formState.isSubmitting}
                        className="mt-2 h-12 w-full bg-emerald-600 font-semibold text-white shadow-premium hover:bg-emerald-500 transition-all"
                        type="submit"
                      >
                        {signUpForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Criar conta grátis
                      </Button>
                    </form>
                  )}
                </div>

                <div className="my-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0a120f] px-2 text-slate-500">Ou continue com</span>
                  </div>
                </div>

                <div>
                  {googleConfigLoading ? (
                    <div className="flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                    </div>
                  ) : googleWebClientId ? (
                    <div className="flex justify-center rounded-xl border border-white/10 bg-white/5 p-1 hover:bg-white/10 transition-colors">
                      <div ref={googleBtnMountRef} className="flex min-h-[40px] w-full justify-center overflow-hidden" />
                    </div>
                  ) : (
                    <p className="text-center text-xs text-slate-500">Autenticação Google indisponível.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}