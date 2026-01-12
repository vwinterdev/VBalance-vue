import { useMutation } from '@tanstack/vue-query'
import { axiosInstance } from '@/modules/common/services/axios'
import type { CreateProfileData, Profile } from '../types/ProfileTypes'

export const useCreateProfileMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateProfileData) => {
      const response = await axiosInstance.post<Profile>('/profile/create', data)
      return response.data
    }
  })
}

