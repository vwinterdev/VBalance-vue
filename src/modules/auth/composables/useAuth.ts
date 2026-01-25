import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { axiosInstance } from '@/modules/common/services/axios'
import { tokenService } from '../../common/services/tokenService'
import type { LoginCredentials, RegisterCredentials, User } from '../types/AuthTypes'

const user = ref<User | null>(null)
const token = ref<string | null>(null)

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      try {
      const response = await axiosInstance.post('/auth/signin', {
        email: params.email,
        password: params.password,
      })
        tokenService.setToken(response.data?.access_token)
        return response.data
      } catch (error) {
        throw "Неправильный email или пароль"
      }
    },
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (params: { email: string; password: string; displayName: string }) => {
      const response = await axiosInstance.post('/auth/signup', {
        email: params.email,
        password: params.password,
        display_name: params.displayName,
      })
      tokenService.setToken(response.data?.access_token)
      return response.data
    },
  })
}

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      return axiosInstance.get('/auth/me')
    },
    enabled: computed(() => tokenService.hasToken()),
  })
}

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const login = async (credentials: LoginCredentials): Promise<void> => {
    // TODO: Реализовать реальную логику авторизации через API
    // Пример:
    // const response = await authService.login(credentials);
    // user.value = response.user;
    // token.value = response.token;
    // localStorage.setItem('auth_token', response.token);

    // Временная заглушка
    await new Promise((resolve) => setTimeout(resolve, 1000))

    user.value = {
      id: '1',
      name: 'Test User',
      email: credentials.email,
      createdAt: new Date().toISOString(),
    }
    token.value = 'mock_token_123'
    tokenService.setToken(token.value)
  }

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    // TODO: Реализовать реальную логику регистрации через API
    // Пример:
    // const response = await authService.register(credentials);
    // user.value = response.user;
    // token.value = response.token;
    // localStorage.setItem('auth_token', response.token);

    // Временная заглушка
    await new Promise((resolve) => setTimeout(resolve, 1000))

    user.value = {
      id: '1',
      name: credentials.name,
      email: credentials.email,
      createdAt: new Date().toISOString(),
    }
    token.value = 'mock_token_123'
    tokenService.setToken(token.value)
  }

  const logout = (): void => {
    user.value = null
    token.value = null
    tokenService.removeToken()
  }

  const checkAuth = (): void => {
    const savedToken = tokenService.getToken()
    if (savedToken) {
      token.value = savedToken
      user.value = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      }
    }
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  }
}
