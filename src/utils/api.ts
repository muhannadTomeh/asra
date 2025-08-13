import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message || 'حدث خطأ غير متوقع'
    return Promise.reject(new Error(message))
  }
)