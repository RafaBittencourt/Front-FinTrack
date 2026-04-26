import { api } from './axios'

/** Client ID Web público definido na API (`Google-Auth:GOOGLE_CLIENT_ID`). Sem variável Vite. */
export async function fetchGoogleWebClientId(): Promise<string> {
  const res = await api.get<Record<string, unknown>>(
    'api/fin-track/auth/google-client-id',
  )
  const d = res.data
  return String(d.clientId ?? d.ClientId ?? '').trim()
}
