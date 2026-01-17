import { useMutation, useQuery } from '@tanstack/vue-query'
import { axiosInstance } from '@/modules/common/services/axios'
import type { CreateProfileData } from '../types/ProfileTypes'
import { Profile } from '../adapters/Profile'


export const useCreateProfileMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateProfileData) => {
      const response = await axiosInstance.post<Profile>('/profile/create', data)
      return response.data
    },
  })
}

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axiosInstance.get<Profile>('/profile/me')
      return Profile.fromRaw(response.data)
    },
  })
}