import axios from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    throwAccessDenied?: boolean
  }
}
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

class AxiosConfig {
  baseUrl = BASE_URL
  axiosConfig = {
    baseURL: this.baseUrl,
    headers: {
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json'
    }
  }

  get getAxiosInstance() {
    const axiosInstance = axios.create(this.axiosConfig)
    axios.interceptors.response.use(
      response => response,
      error => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (error.response.status === 403) {
          // redirect
          return Promise.reject(error)
        }
        return Promise.reject(error)
      }
    )
    return axiosInstance
  }
}
export const https = new AxiosConfig().getAxiosInstance
