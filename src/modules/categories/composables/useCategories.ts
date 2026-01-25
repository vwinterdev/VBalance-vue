import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { Category } from '@/modules/categories/adapters/Category.ts'
import { axiosInstance } from '@/modules/common/services/axios'
import type { ResponseList } from '@/modules/common/types/Raw.ts'

export const useCategoriesQuery = (walletId?: number) => {
  return useQuery({
    queryKey: ['categories', walletId],
    queryFn: async () => {
      const params = walletId ? { walletId } : {}
      const response = await axiosInstance.get<ResponseList>('/category/all', { params })
      return response.data.list.map(Category.fromRaw)
    },
  })
}

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      name: string
      icon: string
      color: string
      secondColor?: string
      type: 'incomes' | 'expenses' | 'mixed'
      walletId: number
    }) => {
      const response = await axiosInstance.post('/category/create', {
        name: params.name,
        icon: params.icon,
        color: params.color,
        second_color: params.secondColor || params.color,
        type: params.type,
        walletId: params.walletId,
      })
      return response.data
    },
    onSuccess: (_data, variables) => {
      // Инвалидируем кэш для конкретного кошелька и общий кэш
      if (variables.walletId) {
        queryClient.invalidateQueries({ queryKey: ['categories', variables.walletId] })
      }
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
