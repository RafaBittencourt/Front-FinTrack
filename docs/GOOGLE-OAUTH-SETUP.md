# Passo a passo: Google Sign-In (OAuth) no FinTrack

Este guia serve para configurar **do zero** o login com Google usado pelo FinTrack (Google Identity Services + API Gestão). O erro **`400: origin_mismatch`** significa que o endereço onde o front abre no browser **não está** em **Origens JavaScript autorizadas** no Google Cloud Console (inclui **porta** e **http** vs **https**).

---

## 1. O que precisas de alinhar

| Onde | O quê |
|------|--------|
| **Browser** | URL exato da barra de endereços ao usar o app (ex.: `http://localhost:5173` com `npm run dev` no Vite). |
| **Google Cloud Console** | Essa mesma origem em **Origens JavaScript autorizadas** (sem path, sem barra final desnecessária — ver secção 5). |
| **API (`appsettings`)** | `Google-Auth:GOOGLE_CLIENT_ID` = **Client ID** do tipo *Aplicativo da Web* que acabaste de criar. |
| **FinTrack** | O front obtém o Client ID com `GET /api/fin-track/auth/google-client-id` — tem de ser o **mesmo** ID configurado na API. |

Se o front corre em `http://localhost:5173` e no Console só tens `http://localhost:5443`, o Google **bloqueia** → `origin_mismatch`.

### 1.1 Front vs API — dois campos diferentes no Google Cloud

O mesmo **ID de cliente OAuth** (tipo *Aplicativo da Web*) pode servir para mais do que um fluxo. No consola tens **dois** sítios distintos:

| Campo no consola | O que colocar | Exemplo |
|------------------|----------------|---------|
| **Origens JavaScript autorizadas** | O site que corre **no browser** — onde o JavaScript do teu front é executado. É isto que o Google compara quando usas o **botão “Entrar com Google”** (Google Identity Services / `id_token`). | `http://localhost:5173` (Vite), `https://app.teudominio.com` |
| **URIs de redirecionamento autorizados** | URLs **completas** (com path) para onde o Google **redireciona o utilizador** depois do login, num fluxo **OAuth clássico no servidor** (o browser abre `accounts.google.com` e volta para a **tua API** com `?code=`). | `https://localhost:6443/api/auth/google/callback` |

- O erro **`origin_mismatch`** no **botão GIS** do FinTrack resolve-se quase sempre com **Origens JavaScript** = URL do **front**, **não** com o callback da API.
- O URI tipo **`https://localhost:6443/api/auth/google/callback`** (como no `GOOGLE_CALLBACK_URL` do `appsettings`) é para **outro** fluxo: login em que a **API** inicia o OAuth e recebe o redirect. Aí o valor tem de estar **exactamente** igual em **URIs de redirecionamento autorizados** (mesmo `https`/`http`, porta e path).

O FinTrack neste repositório usa **`POST /api/fin-track/auth/google`** com **`id_token`** vindo do browser — não abre esse callback na API para o login GIS. Mesmo assim podes (e deves, se usares redirect doutro serviço) registar o callback da API no consola para não bloquear esse fluxo.

**Resumo:** para o login com **botão no front** → origem **JavaScript** = URL da página do FinTrack. Para **redirect só na API** → **URI de redirecionamento** = URL completa do callback na API (ex.: `https://localhost:6443/api/auth/google/callback`).

---

## 2. Google Cloud Console — projeto e APIs

1. Acede a [Google Cloud Console](https://console.cloud.google.com/).
2. Cria um **projeto** novo ou escolhe um existente.
3. Menu **APIs e serviços** → **Biblioteca**.
4. Procura **Google Identity Services** (ou **People API** se o consola pedir; para “Sign in with Google” no browser costuma bastar o fluxo GIS com o cliente Web).
5. Garante que a **Tela de consentimento OAuth** está configurada (menu **APIs e serviços** → **Tela de consentimento OAuth**):
   - Tipo **Externo** (para testes com a tua conta) ou **Interno** (só Google Workspace da organização).
   - Preenche nome da app, e-mail de suporte, domínios se pedidos.
   - Em **Teste**, adiciona o teu e-mail (`romeraguilherme.GRG@gmail.com`) como **utilizador de teste** se a app ainda não estiver em produção.

---

## 3. Credencial OAuth — “Aplicativo da Web”

1. **APIs e serviços** → **Credenciais**.
2. **+ Criar credenciais** → **ID do cliente OAuth**.
3. Tipo de aplicativo: **Aplicativo da Web**.
4. Nome: por exemplo `FinTrack` (só identificação no consola).

---

## 4. Origens JavaScript autorizadas (obrigatório para o botão Google no browser)

Aqui defines **de onde** o JavaScript do teu site pode pedir o token ao Google. Tem de bater **exatamente** com a origem do front.

Exemplos comuns em desenvolvimento (adiciona **todos** os que fores usar):

| Origem | Quando usar |
|--------|-------------|
| `http://localhost:5173` | Vite por defeito (`npm run dev`). |
| `http://localhost:5443` | Se correres o front nessa porta. |
| `http://127.0.0.1:5173` | Alguns setups usam 127.0.0.1 em vez de localhost — conta como origem **diferente**. |
| `https://localhost:5173` | Se o Vite estiver em HTTPS. |

**Regras:**

- **Sem** path: usa `http://localhost:5173` e **não** `http://localhost:5173/`.
- **Com porta**: se o front é `http://localhost:5173`, a origem **tem** de incluir `:5173`.
- `http` e `https` são origens **diferentes** — regista as duas se usares as duas.

**Correção ao `origin_mismatch`:** abre o FinTrack, copia da barra de endereços só `esquema + host + porta` (ex.: `http://localhost:5173`) e adiciona essa linha em **Origens JavaScript autorizadas**. Guarda e espera alguns minutos (o Google avisa que pode demorar até propagar).

---

## 5. URIs de redirecionamento autorizados

Usa este bloco quando a **API** (ou outro backend) faz OAuth com **redirect** para o Google e define `redirect_uri` na autorização.

- Exemplo local: `https://localhost:6443/api/auth/google/callback`  
  (tem de ser **idêntico** ao que a API envia ao Google e ao que está em `GOOGLE_CALLBACK_URL` no `appsettings`, incluindo `http` vs `https` e a porta.)
- Em produção: `https://api.teudominio.com/api/auth/google/callback` (ou o path real do teu projeto).

**Não confundir:** colocar só o callback da API em **Origens JavaScript** está **errado** (origem JavaScript não leva path `/api/...` da mesma forma — o campo pede `origem`, tipo `https://localhost:6443` **sem** path, se alguma vez usasses GIS a servir nesse host, o que é raro). Para GIS no **FinTrack**, a origem é a do **front**.

Se **só** usares o login FinTrack por **`id_token`** (botão GIS), podes não precisar de redirect URIs para esse fluxo; mantém-os preenchidos se a mesma credencial Web for usada por um fluxo redirect na API (ex.: legado ou outro projeto).

---

## 6. Copiar o Client ID para a API

1. Depois de criar o cliente Web, o consola mostra **ID do cliente** (termina em `.apps.googleusercontent.com`).
2. Na API Gestão, em `appsettings.json` (ou variáveis de ambiente em produção):

```json
"Google-Auth": {
  "GOOGLE_CLIENT_ID": "XXXX.apps.googleusercontent.com",
  "GOOGLE_CLIENT_SECRET": "...",
  "GOOGLE_CALLBACK_URL": "..."
}
```

- Para o **login GIS** do FinTrack, o essencial é **`GOOGLE_CLIENT_ID`** (o mesmo valor que nas “Origens JavaScript” da credencial Web).
- Reinicia a API após alterar configuração.

O front chama `GET /api/fin-track/auth/google-client-id`, que devolve este Client ID para inicializar o botão — **não** precisas de duplicar o ID num `.env` do Vite para isso.

---

## 7. Desenvolvimento local (FinTrack + proxy Vite)

No repositório, em desenvolvimento:

- O **Vite** faz proxy de `/api` para a API (`vite.config.ts`).
- O **axios** usa `baseURL: '/'` em dev, para o browser falar com a mesma origem do front e evitar CORS.

Confirma que a **origem que o Google vê** é a do front (ex.: `http://localhost:5173`), não a URL interna do proxy. É essa origem que deve estar no passo 4.

### 7.1 Atenção ao `npm run dev` com `--host` (este projeto)

O `package.json` usa **`vite --host`**, ou seja, podes abrir o FinTrack por:

- `http://localhost:5173`
- `http://127.0.0.1:5173` — **origem diferente** de `localhost` para o Google.
- `http://192.168.x.x:5173` (ou outro IP da tua rede) — **outra origem** outra vez.

Cada URL que realmente abres no browser tem de constar em **Origens JavaScript autorizadas**. Se só registaste `http://localhost:5173` mas abres por `http://127.0.0.1:5173` ou pelo IP da rede → **`origin_mismatch`**.

**Correção:** no Google Cloud, adiciona **todas** as origens que vais usar (localhost, 127.0.0.1 e, se precisares de testar no telemóvel na mesma rede, o IP local com porta). Ou, só para depuração, corre o Vite sem expor rede: `npx vite` (sem `--host`) e usa sempre `http://localhost:5173`.

---

## 8. Produção

Quando publicares o front num domínio real, adiciona em **Origens JavaScript autorizadas** por exemplo:

- `https://app.teudominio.com`

Sem isto, o mesmo erro `origin_mismatch` aparece em produção.

---

## 9. Erro `401: invalid_client` + **no registered origin**

O JSON que o Google deixa descarregar (`client_secret_….json`) **às vezes não traz** o campo `javascript_origins` — isso **não** quer dizer que as origens existam; muitas vezes significa que **ainda não há nenhuma origem** configurada no consola para esse cliente OAuth.

1. Vai a **Google Cloud Console** → **APIs e serviços** → **Credenciais**.
2. Abre o cliente **ID do cliente OAuth 2.0** cujo **ID do cliente** é exactamente o do `GOOGLE_CLIENT_ID` (ex.: `517176531387-kvspdu9crgbtp35nnh2349c2135mph32.apps.googleusercontent.com`).
3. Em **Origens JavaScript autorizadas**, clica **+ ADICIONAR URI** e regista pelo menos `http://localhost:5173` (e `http://127.0.0.1:5173` se usares).
4. **Guardar**.
5. Reinicia a API (o front já pede o Client ID certo) e testa de novo em janela anónima.

Se criaste um **cliente novo** e apagaste o antigo, confirma que o `GOOGLE_CLIENT_ID` no `appsettings` é **só** deste cliente onde estás a pôr as origens.

---

## 10. Checklist rápido quando dá erro (`origin_mismatch`)

- [ ] Olha para a **barra de endereços** com o login aberto: copia só `http(s)://host:porta` (sem path) e confirma que essa linha existe nas **Origens JavaScript** do **mesmo** Client ID que está no `appsettings` (`GOOGLE_CLIENT_ID`).
- [ ] Se usas `127.0.0.1` ou **IP da LAN** (`192.168…`) por causa do `--host`, essas origens também têm de estar no consola (não basta `localhost`).
- [ ] `http` ≠ `https`: se o Vite estiver em HTTPS, a origem tem de ser `https://…`.
- [ ] O **Client ID** na API (`5171…apps.googleusercontent.com`) tem de ser o do cliente OAuth onde adicionaste as origens.
- [ ] Utilizador de teste na tela de consentimento, se a app não estiver publicada.
- [ ] Guardar no Google Cloud, esperar alguns minutos, testar em **janela anónima**.

---

## 11. Referências

- [Erro origin_mismatch](https://developers.google.com/identity/oauth2/web/guides/error#origin_mismatch) (documentação Google).
- [Google Identity Services](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

---

*Documento orientativo; não incluir segredos (Client Secret) em repositórios públicos.*
