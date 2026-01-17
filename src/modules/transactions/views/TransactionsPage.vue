<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import MonthSelector from '@/modules/common/components/MonthSelector.vue'
import { useTransactions } from '@/modules/transactions/composables/useTransactions'
import { useCategoriesQuery } from '@/modules/categories/composables/useCategories'
import { Routes } from '@/router/routes'
import type { Raw } from '@/modules/common/types/Raw'

const router = useRouter()
const openDrawer = inject<() => void>('openDrawer')

const currentDate = ref(new Date())

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const currentMonth = computed(() => months[currentDate.value.getMonth()])
const currentYear = computed(() => currentDate.value.getFullYear())

const filters = computed(() => ({
  month: currentDate.value.getMonth() + 1,
  year: currentDate.value.getFullYear()
}))

const { data: transactions, isLoading } = useTransactions(filters)
const { data: categories } = useCategoriesQuery()

const getCategoryById = (categoryId: number) => {
  return categories.value?.find(c => c.id === categoryId)
}

const groupedTransactions = computed(() => {
  if (!transactions.value) return {}

  const groups: Record<string, typeof transactions.value> = {}

  transactions.value.forEach((transaction: Raw) => {
    const date = new Date(transaction.createdAt)
    const dateKey = date.toLocaleDateString('ru-RU')

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(transaction)
  })

  return groups
})

const sortedDates = computed(() => {
  return Object.keys(groupedTransactions.value).sort((a, b) => {
    const dateA = new Date(a.split('.').reverse().join('-'))
    const dateB = new Date(b.split('.').reverse().join('-'))
    return dateB.getTime() - dateA.getTime()
  })
})

const totalIncome = computed(() => {
  return transactions.value?.reduce((sum: number, t: Raw) => {
    return t.isPositive ? sum + t.balance : sum
  }, 0) || 0
})

const totalExpense = computed(() => {
  return transactions.value?.reduce((sum: number, t: Raw) => {
    return !t.isPositive ? sum + Math.abs(t.balance) : sum
  }, 0) || 0
})

const balance = computed(() => totalIncome.value - totalExpense.value)

const navigateToCreateTransaction = () => {
  router.push({ name: Routes.CREATE_TRANSACTION.name })
}

const formatDate = (dateString: string) => {
  const [day, month, year] = dateString.split('.')
  const date = new Date(+year!, +month! - 1, +day!)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера'
  }
  return dateString
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <Button
        icon="pi pi-bars"
        text
        rounded
        @click="openDrawer"
        aria-label="Меню"
        class="text-gray-600"
      />
      <h1 class="text-lg font-semibold text-gray-800">Транзакции</h1>
      <div class="w-10"></div>
    </div>

    <div class="bg-white px-4 py-4 shadow-sm">
      <div class="max-w-md mx-auto">
        <h2 class="text-center text-lg font-semibold text-gray-700 mb-3">{{ currentMonth }} {{ currentYear }}</h2>
        
        <div class="grid grid-cols-3 gap-3 mb-3">
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <p class="text-xs text-gray-500 mb-1">Доходы</p>
            <p class="text-sm font-semibold text-green-600">+{{ totalIncome.toLocaleString('ru-RU') }} ₽</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <p class="text-xs text-gray-500 mb-1">Расходы</p>
            <p class="text-sm font-semibold text-red-600">-{{ totalExpense.toLocaleString('ru-RU') }} ₽</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <p class="text-xs text-gray-500 mb-1">Баланс</p>
            <p class="text-sm font-semibold text-gray-800">{{ balance.toLocaleString('ru-RU') }} ₽</p>
          </div>
        </div>
      </div>

      <MonthSelector v-model:currentDate="currentDate" position="static" />
    </div>

    <div class="flex-1 overflow-y-auto p-4 pb-24">
      <div class="max-w-md mx-auto">
        <div v-if="isLoading" class="flex items-center justify-center h-64">
          <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
        </div>

        <div v-else-if="!transactions || transactions.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500">
          <i class="pi pi-inbox text-6xl mb-4"></i>
          <p class="text-lg font-medium">Нет транзакций</p>
          <p class="text-sm">Добавьте первую транзакцию</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="date in sortedDates" :key="date" class="space-y-2">
            <h3 class="text-sm font-semibold text-gray-600 px-2">{{ formatDate(date) }}</h3>
            
            <div class="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
              <div
                v-for="transaction in groupedTransactions[date]"
                :key="transaction.id"
                class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div
                    v-if="getCategoryById(transaction.categoryId)"
                    class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm"
                    :style="{
                      background: `linear-gradient(135deg, ${getCategoryById(transaction.categoryId)?.color}, ${getCategoryById(transaction.categoryId)?.secondColor || getCategoryById(transaction.categoryId)?.color})`
                    }"
                  >
                    {{ getCategoryById(transaction.categoryId)?.icon }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">
                      {{ getCategoryById(transaction.categoryId)?.name || 'Без категории' }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ new Date(transaction.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }}
                    </p>
                  </div>
                </div>
                <div
                  :class="[
                    'text-lg font-semibold',
                    transaction.isPositive ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ transaction.isPositive ? '+' : '-' }}{{ Math.abs(transaction.balance).toLocaleString('ru-RU') }} ₽
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
      <Button
        icon="pi pi-plus"
        label="Добавить транзакцию"
        severity="primary"
        size="large"
        @click="navigateToCreateTransaction"
        class="w-full shadow-lg"
      />
    </div>
  </div>
</template>
