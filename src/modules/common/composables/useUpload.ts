import { useMutation } from "@tanstack/vue-query"
import { axiosInstance } from "../services/axios"

export const useUploadImageMutation = () => {
    return useMutation({
        mutationFn: async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        const response = await axiosInstance.post('upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    }})
}