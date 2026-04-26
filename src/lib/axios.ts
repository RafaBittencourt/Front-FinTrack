import axios from 'axios'

/** Em dev, pedidos vão para a mesma origem do Vite e o `server.proxy` encaminha `/api` → API (evita CORS). */
export const api = axios.create({
  baseURL: import.meta.env.PROD ? 'https://api.fintrack.app' : '/',
})
