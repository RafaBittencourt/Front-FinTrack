import { api } from './lib/axios'

async function pageLoader(url: string, filterUrl: string = '?pageNumber=1&maxResultCount=20') {
  const response = await api.get(url + filterUrl, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  return response.data.result
}

export { pageLoader }
