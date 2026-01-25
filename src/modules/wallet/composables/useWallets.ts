import { computed, type ComputedRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { axiosInstance } from '@/modules/common/services/axios'
import { Wallet } from '../adapters/Wallet'
import type { Raw } from '@/modules/common/types/Raw'

// Получить все кошельки
export const useWalletsQuery = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await axiosInstance.get<Raw[]>('/wallet/all')
      return response.data.map(Wallet.fromRaw)
    }
  })
}

// Получить один кошелек
export const useWalletQuery = (walletId: number | ComputedRef<number>) => {
  const walletIdValue = computed(() => {
    return typeof walletId === 'number' ? walletId : walletId.value
  })
  
  return useQuery({
    queryKey: computed(() => ['wallet', walletIdValue.value]),
    queryFn: async () => {
      const response = await axiosInstance.get<Raw>(`/wallet/${walletIdValue.value}`)
      return Wallet.fromRaw(response.data)
    },
    enabled: computed(() => !!walletIdValue.value)
  })
}

// Создать кошелек
interface CreateWalletDto {
  name: string
  currency?: string
  icon?: string
  color?: string
}

export const useCreateWalletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateWalletDto) => {
      const response = await axiosInstance.post('/wallet/create', params)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    }
  })
}

// Обновить кошелек
interface UpdateWalletDto {
  name?: string
  currency?: string
  icon?: string
  color?: string
}

export const useUpdateWalletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateWalletDto }) => {
      const response = await axiosInstance.put(`/wallet/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', variables.id] })
    }
  })
}

// Удалить кошелек
export const useDeleteWalletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (walletId: number) => {
      const response = await axiosInstance.delete(`/wallet/${walletId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    }
  })
}
