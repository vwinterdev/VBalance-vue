import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { Category } from '@/modules/categories/adapters/Category.ts'
import { axiosInstance } from '@/modules/common/services/axios'
import type { ResponseList } from '@/modules/common/types/Raw.ts'

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get<ResponseList>('/category/all')
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
      type: 'incomes' | 'expenses'
    }) => {
      const response = await axiosInstance.post('/category/create', {
        name: params.name,
        icon: params.icon,
        color: params.color,
        second_color: params.secondColor || params.color,
        type: params.type,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
