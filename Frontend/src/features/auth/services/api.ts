import axios from "axios"
import type { AxiosInstance } from "axios"

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - handled by route")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  }
)

export default api