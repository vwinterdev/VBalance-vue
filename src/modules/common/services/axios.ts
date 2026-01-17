import axios from 'axios'
import router from '@/router'
import { Routes } from '@/router/routes'
import { env } from '../configs/env'
import { HTTPStatus } from '../enums/HTTPStatus'
import { tokenService } from './tokenService'

export const axiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === HTTPStatus.NOT_CONFIRMED) {
      router.push(Routes.EMAIL_VERIFICATION)
    }
    if (error.response?.status === HTTPStatus.UNAUTHORIZED) {
      tokenService.removeToken()
      router.push(Routes.LOGIN)
    }
    return Promise.reject(error)
  },
)
