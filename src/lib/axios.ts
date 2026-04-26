import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://api.fintrack.app' : 'https://localhost:44300/',
})
