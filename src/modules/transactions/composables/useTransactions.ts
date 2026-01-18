
import { computed, type ComputedRef } from "vue"
import type { Raw } from '@/modules/common/types/Raw.ts'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { axiosInstance } from '@/modules/common/services/axios'
import { Transaction } from "../adapters/Transaction"
import { useFiltersDate } from "@/modules/common/composables/useFiltersDate"

export const useTransactions = ( filters: ComputedRef<Raw>) => {
    console.log('useTransactions', filters.value)
    return useQuery({
        queryKey: computed(() => ['transactions', filters.value]),
        queryFn: async () => {
            const response = await axiosInstance.get('/transactions/list', { params: filters.value })
            return response.data.list.map((transaction: Raw) => Transaction.fromRaw(transaction))
        },
    })
}

export const useCreateTransactionMutation = () => {
    const queryClient = useQueryClient()
    const { filtersNow } = useFiltersDate()

    return useMutation({
        mutationFn: async (params: { balance: number; categoryId: number }) => {
            const response = await axiosInstance.post('/transactions/create', params)
            return Transaction.fromRaw(response.data)
        },

        onMutate: async (newTransactionParams) => {
            const queryKey = ['transactions', filtersNow.value]
            console.log('onMutate - queryKey:', queryKey)

            // Отменяем исходящие запросы
            await queryClient.cancelQueries({ queryKey })

            // Сохраняем предыдущее состояние
            const previousTransactions = queryClient.getQueryData<Transaction[]>(queryKey)
            console.log('onMutate - previousTransactions:', previousTransactions)

            // Создаём временный объект транзакции для оптимистичного обновления
            const optimisticTransaction = new Transaction({
                id: Date.now(), // Временный ID
                balance: newTransactionParams.balance,
                category_id: newTransactionParams.categoryId,
                user_id: 0, // Заполнится после ответа сервера
                is_positive: newTransactionParams.balance > 0,
                created_at: new Date().toISOString(),
            })

            console.log('onMutate - optimisticTransaction:', optimisticTransaction)

            // Оптимистично обновляем кэш
            queryClient.setQueryData<Transaction[]>(queryKey, (old) => {
                console.log('onMutate - old data:', old)
                if (!old) return [optimisticTransaction]
                const newData = [...old, optimisticTransaction]
                console.log('onMutate - new data:', newData)
                return newData
            })

            return { previousTransactions }
        },

        onError: (err, newTransaction, context) => {
            console.error('onError - rolling back', err)
            // Откатываем изменения при ошибке
            if (context?.previousTransactions) {
                queryClient.setQueryData(
                    ['transactions', filtersNow.value],
                    context.previousTransactions
                )
            }
        },

        onSettled: () => {
            console.log('onSettled - refetching')
            // Синхронизируем с сервером после завершения
            queryClient.invalidateQueries({ queryKey: ['transactions', filtersNow.value] })
        }
    })
}