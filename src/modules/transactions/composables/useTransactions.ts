
import { computed, type ComputedRef } from "vue"
import type { Raw } from '@/modules/common/types/Raw.ts'
import {  useQuery } from '@tanstack/vue-query'
import { axiosInstance } from '@/modules/common/services/axios'
import { Transaction } from "../adapters/Transaction"

export const useTransactions = ( filters: ComputedRef<Raw>) => {
    return useQuery({
        queryKey: computed(() => ['transactions', filters.value]),
        queryFn: async () => { 
            const response = await axiosInstance.get('/transactions/list', { params: filters.value })
            return response.data.list.map((transaction: Raw) => Transaction.fromRaw(transaction))
        },
    })
}