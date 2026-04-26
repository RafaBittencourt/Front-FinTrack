# Documentação do código-fonte — `Front-FinTrack/src`

Este documento descreve a organização do diretório `src` da aplicação **FinTrack** (React + Vite + TypeScript), o fluxo da aplicação e como o front integra com a **API** (HTTP).

---

## 1. Visão geral

O `src` contém uma SPA de gestão financeira com:

- **React 18** e **TypeScript**
- **Vite** como bundler e servidor de desenvolvimento
- **React Router DOM v6** (`createBrowserRouter`) para rotas e loaders
- **Axios** para chamadas HTTP centralizadas em `lib/axios.ts`
- **Context API** para estado global do utilizador autenticado
- **react-hook-form** + **Zod** em formulários críticos (ex.: login, contas)
- **Tailwind CSS** e componentes de UI (Radix + padrão *shadcn*)
- **Sonner** para notificações toast
- **react-helmet-async** para títulos de página

**Ponto de entrada:** `main.tsx` monta `<App />`.  
**Arranque da app:** `App.tsx` envolve a árvore com `HelmetProvider`, `DataProvider` (contexto de utilizador) e `RouterProvider`.

---

## 2. Estrutura de pastas (mapa mental)

```
src/
├── main.tsx                 # ReactDOM.createRoot
├── App.tsx                  # Providers globais + router
├── router.tsx               # Definição de rotas, loaders e guards
├── pageLoaders.tsx          # GET inicial paginado para loaders de rota
├── ProtectedRoute.tsx       # Guard por permissão (client-side)
├── vite-env.d.ts            # Referência tipos Vite
│
├── lib/                     # HTTP, CRUD genérico, sessão, utilitários
│   ├── axios.ts
│   ├── fintrackGoogleConfig.ts  # Client ID Google (GET na API)
│   ├── crud.tsx
│   ├── interface.tsx        # Tipos de resposta/erro HTTP
│   ├── fintrackSession.ts   # Persistência pós-login FinTrack
│   ├── permissions.ts       # (legado comentado)
│   ├── utils.ts
│   └── maskFunction.tsx
│
├── context/
│   └── userContext.tsx      # DataProvider + useUserData
│
├── Hooks/
│   ├── useToken.ts          # Validação simples de sessão (loader)
│   ├── useTokenValidation.ts # Redireciona se token/expiração inválidos
│   └── use-mobile.tsx
│
├── components/              # UI partilhada, sidebar, inputs compostos, ui/*
├── pages/
│   ├── _layouts/            # app.tsx (área autenticada), auth.tsx
│   ├── auth/                # sign-in (landing + modal login)
│   └── app/                 # Dashboard, Cadastros, Configurações, etc.
├── types/                   # Declarações globais (ex.: google-gsi.d.ts)
└── assets/                  # Imagens (referenciadas com alias @/)
```

Pastas com **cadastros exemplo** (Contas, Categorias, Cartões) seguem o mesmo padrão de listagem CRUD documentado na secção 8.

---

## 3. Integração com a API

### 3.1 Cliente HTTP (`lib/axios.ts`)

É criada uma instância **Axios** com `baseURL`:

| Ambiente    | `baseURL`                          |
|------------|-------------------------------------|
| Produção   | `https://api.fintrack.app`          |
| Desenvolvimento | `/` (mesma origem do Vite)   |

Em dev, o **Vite** (`vite.config.ts`) faz `proxy` de `/api` para `https://localhost:44300` (`secure: false` para certificado de desenvolvimento). Os paths continuam relativos (ex.: `api/fin-track/auth/signin`).

Com `ASPNETCORE_ENVIRONMENT=Development`, `appsettings.Development.json` no Host inclui origens típicas do Vite em `CorsOrigins` (útil se algum pedido for direto à API sem proxy).

### 3.2 Dois “estilos” de API no mesmo projeto

O código mistura:

1. **Auth FinTrack (ASP.NET Core, rotas REST explícitas)**  
   - `POST api/fin-track/auth/signin`  
   - `POST api/fin-track/auth/signup`  
   - `POST api/fin-track/auth/google`  
   - Corpo/resposta tipados com `FinTrackAuthResponse` em `lib/fintrackSession.ts`.  
   - Estas rotas **não** usam o prefixo `api/services/app/`.

2. **Serviços estilo ABP / legado (`api/services/app/...`)**  
   - Usados por `crud.tsx`, `pageLoaders.tsx` e alguns `api.get` diretos.  
   - Padrão: `{baseURL}api/services/app/{NomeDoServiço}/{Ação}`  
   - Ações comuns: `Create`, `Update`, `GetAll`, `Get`, `Release`.  
   - Respostas esperadas no formato `{ success, result, error? }` alinhado com `IResponseError` / `IResponseRequestError` em `lib/interface.tsx`.

**Nota de alinhamento com o repositório ApiGestão:** no *host* atual deste mono-repo, controladores como `UsuariosController` e `FuncoesController` expõem rotas do tipo `api/usuarios` e `api/funcoes`, **diferentes** de `api/services/app/Usuario/GetAll`. O front foi desenhado para consumir o contrato ABP-like; para funcionar contra o host atual seria necessário **adaptar URLs** no front ou **expor no backend** rotas/proxy compatíveis com o que `crud.tsx` e `pageLoader` esperam.

### 3.3 Autenticação nas chamadas autenticadas

Para a maioria dos pedidos após login:

```http
Authorization: Bearer <token>
```

O token é lido de `localStorage.getItem('token')` (definido em `persistFinTrackAuth` após sign-in/sign-up/Google).

**Auth FinTrack:** os endpoints `signin`, `signup` e `google` são chamados **sem** header `Authorization` (utilizador ainda não autenticado).

### 3.4 Sessão e expiração (`lib/fintrackSession.ts` + hooks)

Após login bem-sucedido:

| Chave `localStorage` | Conteúdo |
|----------------------|----------|
| `token`              | JWT (`accessToken`) |
| `expireTime`         | Timestamp (ms) de `expiresAtUtc` |
| `fintrackUsuario`    | JSON do `FinTrackUsuarioDto` |
| `userId`             | Id do utilizador (string) |

- **`Hooks/useToken.ts` — `getUser()`:** usado no **loader** da área app (`router.tsx`). Considera sessão válida se existe `token` e `expireTime > Date.now()`. Caso contrário limpa storage e força fluxo para login.
- **`Hooks/useTokenValidation.ts`:** usado em `AppLayout`; agenda verificação até à data de expiração e redireciona para `/sign-in` se o token faltar ou estiver expirado.

### 3.5 Contexto de utilizador (`context/userContext.tsx`)

`DataProvider` expõe via `useUserData()`:

- `userId`, `nomeUsuario`, `tipoLicenca`, `permissions`, `loading`
- `setToken`, `setUserId`
- `checkPermission(nome)` — verifica permissões no array `permissions`

As permissões efetivas vêm hoje de **`FINTRACK_PROVISIONAL_PERMISSIONS`** em `fintrackSession.ts` (lista fixa), comentada no código como provisória até a API expor roles FinTrack. Isto alinha menus (`App-sideBar.tsx`) e `ProtectedRoute` com nomes estilo `Support.Configuracao.*`.

---

## 4. Rotas (`router.tsx`)

### 4.1 Área autenticada (`AppLayout`)

- **Path:** `/` com `element: <AppLayout />`
- **Loader:** `getUser()` — se falhar, `redirect('/sign-in')` e `localStorage.clear()`.
- **Filhos:**
  - `/` → redireciona para `/dashboard`
  - `/dashboard` → `Dashboard`
  - `/financeiro/movimentacoes` → `Dashboard` (placeholder)
  - `/financeiro/contas` → `Contas` com `loader: pageLoader('api/services/app/FinTrackAccount/GetAll')`
  - `/configuracoes/usuarios` → `ProtectedRoute` + `Usuarios`, loader `api/services/app/Usuario/GetAll`
  - `/configuracoes/funcoes` → `ProtectedRoute` + `Funcoes`, loader `api/services/app/Funcao/GetAll`
  - `/configuracoes/empresa` → `ProtectedRoute` + `Configuracoes`, loader `api/services/app/Funcao/GetAll` (reutilização)

Rotas comentadas no ficheiro: exemplos de cadastro (categorias, centros de custo) com outros serviços.

### 4.2 Área pública

- `AuthLayout` com `/sign-in` → componente `SignIn`.

---

## 5. Camada `lib` — detalhe da integração

### 5.1 `pageLoaders.tsx`

```ts
pageLoader(url, filterUrl = '?pageNumber=1&maxResultCount=20')
```

Faz `GET url + filterUrl` com `Authorization: Bearer …` e devolve `response.data.result` para hidratar `useLoaderData()` nas páginas.

### 5.2 `crud.tsx` — funções assíncronas

| Função | Método HTTP | URL típica | Notas |
|--------|-------------|------------|--------|
| `CreateAsync(data, url)` | POST | `{url}/Create` | `url` sem barra final; ex. `api/services/app/FinTrackAccount` |
| `UpdateAsync(data, url)` | PUT | `{url}/Update` | |
| `GetAllAsync(filter, url)` | GET | `{url}/GetAll?…` | Monta query string a partir do objeto `filter`; ignora chaves `statusFiltro`, `slaFiltro`; omite `undefined`, `''`, `'todos'`, `null`; arrays → múltiplos `key=value` |
| `GetAsync(id, url)` | GET | `{url}/Get?id={id}` | |
| `GetDinamicAsync(url, filter?)` | GET | `{url}?…` | Resultado esperado em `response.data.result.items` |
| `ReleasedAsync(data, url)` | POST | `{url}/Release` | |
| `UploadFile(data)` | POST | `api/services/app/UploadToGoogleDrive` | Path fixo |

Todas devolvem `Promise<IResponseError<T>>` com `success`, `message` e opcionalmente `result`. Erros Axios com `response.data.error.message` são mapeados.

**Inconsistências a ter em conta (manutenção):** por exemplo `UpdateAsync` atribui `result: response as A` em vez de `response.data`; convém validar contra a API real ao integrar.

### 5.3 `interface.tsx`

- `IResponseError<T>` — formato unificado de retorno das funções CRUD.
- `IResponseRequestError` — cast de erro Axios com `response.data.error.message`.

### 5.4 `utils.ts` e `maskFunction.tsx`

Utilitários de UI/formatação (ex.: `cn` para classes Tailwind); máscaras para inputs quando aplicável.

---

## 6. Página de autenticação (`pages/auth/sign-in.tsx`)

- Landing com CTA “Acessar Sistema” e modal com separador **Entrar** / **Criar conta**.
- **Sign-in:** `POST api/fin-track/auth/signin` com `{ login, senha }`.
- **Sign-up:** `POST api/fin-track/auth/signup` com `login`, `email`, `senha`, opcional `nomeExibicao`.
- **Google:** script GSI; o Client ID vem só de `GET api/fin-track/auth/google-client-id` (`lib/fintrackGoogleConfig.ts`, alinhado a `Google-Auth:GOOGLE_CLIENT_ID` na API). Callback: `POST api/fin-track/auth/google` com `{ idToken: ... }`.
- Após sucesso: `persistFinTrackAuth`, `setToken`, `setUserId`, `navigate('/dashboard')`.
- Se já existir `token` no `localStorage`, redireciona para `/dashboard`.

Erros da API são extraídos por `mensagemErroApi` (campos `message`, `detail`, `title`).

---

## 7. Dashboard e gráficos

- `pages/app/dashboard/dashboard.tsx` — *shell* com breadcrumb e `DashboardPrincipal`.
- `DashboardPrincipal.tsx` carrega dados com:

  `GET api/services/app/Dashboard/GetDashboardGraficos` + header Bearer.

Espera `response.data.result` com estrutura `IDashboardGeralDto` (listas para gráficos Recharts). Os nomes de campos no front (`chamadosPorCategoria`, etc.) refletem um domínio de “chamados” reutilizado para protótipo financeiro (mapeamentos `STATUS_MAP`, `CATEGORIA_FINANCEIRA_MAP`).

---

## 8. Padrão de ecrã de listagem CRUD (ex.: Contas)

Documentado no próprio `contas.tsx`:

1. **Dados iniciais:** `useLoaderData()` vindo do `pageLoader` da rota.
2. **Estado:** filtros, paginação, `urlToRequest` (ex.: `api/services/app/FinTrackAccount`).
3. **Recarregar:** `GetAllAsync(filterData, urlToRequest)` quando filtros ou paginação mudam.
4. **Formulário:** componente `*Form` com `CreateAsync` / `UpdateAsync` / `GetAsync` e `typeRequest: 'create' | 'update'`.

O mesmo padrão aparece em **Usuários**, **Funções**, **Configurações**, e pastas **Cadastros** (Categorias, Cartões, Contas).

---

## 9. Componentes principais

| Área | Ficheiros / pasta | Função |
|------|-------------------|--------|
| Navegação | `App-sideBar.tsx`, `nav-link.tsx`, `nav-style.tsx` | Menu lateral, filtro por `checkPermission`, logout (limpa storage) |
| Layout | `breadcrumb.tsx`, `pagination.tsx` | Navegação contextual e paginação |
| Formulários | `InputText/`, `InputSelect/`, `InputCurrency/` | Inputs reutilizáveis |
| UI base | `components/ui/*` | Primitivos Radix + Tailwind (botões, diálogos, tabelas, etc.) |
| Segurança de rota | `ProtectedRoute.tsx` | Exige `userId` e, se definido, `permission` |

---

## 10. Variáveis de ambiente (Vite)

Não há variáveis obrigatórias para o login Google: o Client ID Web é obtido em runtime da API.

---

## 11. Inventário de endpoints referenciados no `src`

*(Paths relativos à `baseURL` do axios.)*

**Auth FinTrack**

- `api/fin-track/auth/google-client-id` (GET)
- `api/fin-track/auth/signin` (POST)
- `api/fin-track/auth/signup` (POST)
- `api/fin-track/auth/google` (POST)

**Serviços `api/services/app/…` (via código)**

- `…/FinTrackAccount` — `GetAll`, `Create`, `Update`, `Get` (via CRUD + loader)
- `…/Usuario` — `GetAll` (+ CRUD nas telas de utilizadores)
- `…/Funcao` — `GetAll` (+ telas de permissões/funções)
- `…/Dashboard/GetDashboardGraficos` — GET
- `…/UploadToGoogleDrive` — POST (`UploadFile`)

Comentários no código referem ainda `Profile/CreateOrUpdateProfilePicture`, `Profile/GetProfilePicture`, `api/TokenAuth/LogOut` — desativados ou não usados no fluxo atual.

---

## 12. Scripts npm (projeto `Front-FinTrack`)

- `npm run dev` — Vite com `--host`
- `npm run build` — `tsc && vite build`
- `npm run lint` — ESLint
- `npm run preview` — pré-visualização da build

---

## 13. Boas práticas para evolução

1. **Unificar contrato da API:** decidir se o backend expõe REST por recurso (`api/usuarios`) ou contrato ABP (`api/services/app/Usuario/GetAll`) e alinhar `router`, `crud` e chamadas soltas.
2. **Interceptor Axios:** centralizar header `Authorization` e tratamento de 401 em vez de repetir em cada função.
3. **Permissões:** substituir `FINTRACK_PROVISIONAL_PERMISSIONS` por dados vindos do JWT ou de um endpoint `/me` quando existir.
4. **Tipagem de erros:** alinhar `mensagemErroApi` (auth) com o formato `error.message` usado em `crud.tsx`.

---

*Documento gerado a partir da análise do código em `Front-FinTrack/src` e dos controladores FinTrack no repositório ApiGestão. Atualize este ficheiro sempre que rotas ou contratos de API mudarem.*
