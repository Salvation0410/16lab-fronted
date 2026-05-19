import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const http = axios.create({
  baseURL: '/api',
  timeout: 20000
})

http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    const payload = response.data
    if (payload?.code !== 200) {
      return Promise.reject(new Error(payload?.message || '请求失败'))
    }
    return payload.data
  },
  (error) => Promise.reject(new Error(error.response?.data?.message || error.message || '网络异常'))
)

export default http
