import { useMutation, useQuery } from '@tanstack/vue-query'
import { axiosInstance } from '@/modules/common/services/axios'
import { Category } from '@/modules/categories/adapters/Category.ts'
import type { ResponseList } from '@/modules/common/types/Raw.ts'

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get<ResponseList>('/category/all')
      return response.data.list.map(Category.fromRaw)  
    }
  })
}

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: async (params: { balance: number, categoryId: string }) => {
      const response = await axiosInstance.post('/transactions/create', params)
      return response.data
    }
  })
}
