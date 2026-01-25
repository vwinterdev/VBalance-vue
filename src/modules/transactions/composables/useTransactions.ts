
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

export const useWalletTransactions = (walletId: ComputedRef<number | undefined>, filters: ComputedRef<Raw>) => {
    return useQuery({
        queryKey: computed(() => ['transactions', 'wallet', walletId.value, filters.value]),
        queryFn: async () => {
            const params = { ...filters.value, walletId: walletId.value }
            const response = await axiosInstance.get('/transactions/list', { params })
            return response.data.list.map((transaction: Raw) => Transaction.fromRaw(transaction))
        },
        enabled: computed(() => !!walletId.value),
    })
}

export const useCreateTransactionMutation = () => {
    const queryClient = useQueryClient()
    const { filtersNow } = useFiltersDate()

    return useMutation({
        mutationFn: async (params: { balance: number; categoryId: number; walletId: number }) => {
            const response = await axiosInstance.post('/transactions/create', params)
            return Transaction.fromRaw(response.data)
        },

        onMutate: async (newTransactionParams) => {
            // Определяем queryKey в зависимости от того, есть ли walletId
            const queryKey = newTransactionParams.walletId 
                ? ['transactions', 'wallet', newTransactionParams.walletId, filtersNow.value]
                : ['transactions', filtersNow.value]
            
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

            // Оптимистично обновляем кэш - добавляем в начало списка (транзакции отсортированы по дате DESC)
            queryClient.setQueryData<Transaction[]>(queryKey, (old) => {
                console.log('onMutate - old data:', old)
                if (!old) return [optimisticTransaction]
                const newData = [optimisticTransaction, ...old] // Добавляем в начало
                console.log('onMutate - new data:', newData)
                return newData
            })

            return { previousTransactions, queryKey }
        },

        onSuccess: (data, newTransactionParams, context) => {
            console.log('onSuccess - updating with real data:', data)
            // Обновляем кэш с реальными данными от сервера (включая категорию)
            if (context?.queryKey) {
                queryClient.setQueryData<Transaction[]>(context.queryKey, (old) => {
                    if (!old) return [data]
                    
                    // Находим оптимистичную транзакцию по временному ID (большое число из Date.now())
                    const optimisticIndex = old.findIndex(t => {
                        // Временный ID - это большое число (Date.now() возвращает миллисекунды)
                        const isTemporaryId = t.id > 1000000000000
                        // Проверяем также по categoryId и балансу для надежности
                        // Приводим к числам для сравнения
                        const tCategoryId = typeof t.categoryId === 'string' ? parseInt(t.categoryId) : t.categoryId
                        const paramsCategoryId = typeof newTransactionParams.categoryId === 'string' 
                            ? parseInt(newTransactionParams.categoryId) 
                            : newTransactionParams.categoryId
                        return isTemporaryId && 
                               tCategoryId === paramsCategoryId &&
                               Math.abs(Math.abs(t.balance) - Math.abs(newTransactionParams.balance)) < 0.01
                    })
                    
                    if (optimisticIndex >= 0) {
                        // Заменяем оптимистичную транзакцию на реальную
                        const newData = [...old]
                        newData[optimisticIndex] = data
                        // Сортируем по дате создания (DESC) - новые сверху
                        return newData.sort((a, b) => {
                            const dateA = new Date(a.createdAt).getTime()
                            const dateB = new Date(b.createdAt).getTime()
                            return dateB - dateA
                        })
                    }
                    
                    // Если не нашли оптимистичную, добавляем в начало и сортируем
                    const newData = [data, ...old.filter(t => t.id !== data.id)]
                    return newData.sort((a, b) => {
                        const dateA = new Date(a.createdAt).getTime()
                        const dateB = new Date(b.createdAt).getTime()
                        return dateB - dateA
                    })
                })
            }
        },

        onError: (err, _newTransactionParams, context) => {
            console.error('onError - rolling back', err)
            // Откатываем изменения при ошибке
            if (context?.previousTransactions && context?.queryKey) {
                queryClient.setQueryData(context.queryKey, context.previousTransactions)
            }
        },

        onSettled: (_data, _error, variables) => {
            console.log('onSettled - refetching if needed')
            // Инвалидируем только если была ошибка или данные не обновились через onSuccess
            if (_error) {
                queryClient.invalidateQueries({ queryKey: ['transactions', filtersNow.value] })
                if (variables.walletId) {
                    queryClient.invalidateQueries({ queryKey: ['transactions', 'wallet', variables.walletId] })
                }
            }
        }
    })
}