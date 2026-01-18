<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import MonthSelector from '@/modules/common/components/MonthSelector.vue'
import { Routes } from '@/router/routes'
import { useTransactions } from '@/modules/transactions/composables/useTransactions'
import { useCategoriesQuery } from '@/modules/categories/composables/useCategories'
import { useTransactionStats } from '@/modules/transactions/composables/useTransactionStats'

const router = useRouter()
const openDrawer = inject<() => void>('openDrawer')

const currentDate = ref(new Date())
const chartData = ref()

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

const { data: transactions, isLoading: isLoadingTransactions } = useTransactions(filters)
const { data: categories, isLoading: isLoadingCategories } = useCategoriesQuery()

const {
  totalIncome,
  totalExpense,
  balance,
  categoryStats
} = useTransactionStats(transactions, categories)

const isLoading = computed(() => isLoadingTransactions.value || isLoadingCategories.value)

const navigateToCreateTransaction = () => {
  router.push({ name: Routes.CREATE_TRANSACTION.name })
}


const navigateToCategories = () => {
  router.push({ name: Routes.CATEGORIES.name })
}

const setChartData = () => {
  const expenseCategories = categoryStats.value.filter(stat => stat.category.type === 'expenses')

  if (expenseCategories.length === 0) {
    return {
      datasets: [{
        data: [1],
        backgroundColor: ['#e5e7eb'],
        borderWidth: 0
      }],
      labels: ['Нет данных']
    }
  }

  return {
    datasets: [{
      data: expenseCategories.map(stat => stat.amount),
      backgroundColor: expenseCategories.map(stat => stat.category.color),
      borderWidth: 0,
      hoverOffset: 10
    }],
    labels: expenseCategories.map(stat => stat.category.name)
  }
}

watch([categoryStats], () => {
  chartData.value = setChartData()
}, { immediate: true })

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '70%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function(context: any) {
          const label = context.label || ''
          const value = context.parsed || 0
          return `${label}: ${value.toLocaleString('ru-RU')} ₽`
        }
      }
    }
  }
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
      <h1 class="text-lg font-semibold text-gray-800">VBalance</h1>
      <Button
        icon="pi pi-cog"
        text
        rounded
        @click="navigateToCategories"
        aria-label="Настройки категорий"
        class="text-gray-600"
      />
    </div>

    <div class="flex-1 flex flex-col items-center justify-center p-6 pb-32">
      <div class="w-full max-w-md">
        <h2 class="text-center text-xl font-semibold text-gray-700 mb-2">{{ currentMonth }} {{ currentYear }}</h2>

        <div v-if="isLoading" class="flex items-center justify-center h-80">
          <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
        </div>

        <div v-else class="relative">
          <Chart
            type="doughnut"
            :data="chartData"
            :options="chartOptions"
            class="w-full max-w-sm mx-auto"
          />
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p class="text-sm text-gray-500 mb-1">Баланс</p>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800">
              {{ balance.toLocaleString('ru-RU') }} ₽
            </h1>
            <div class="mt-4 flex gap-6 text-sm">
              <div class="text-center">
                <p class="text-gray-500 text-xs">Доходы</p>
                <p class="text-green-600 font-semibold">+{{ totalIncome.toLocaleString('ru-RU') }}</p>
              </div>
              <div class="text-center">
                <p class="text-gray-500 text-xs">Расходы</p>
                <p class="text-red-600 font-semibold">-{{ totalExpense.toLocaleString('ru-RU') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isLoading && categoryStats.length > 0" class="mt-8 space-y-2">
          <div
            v-for="stat in categoryStats.slice(0, 5)"
            :key="stat.category.id"
            class="flex items-center gap-3 px-4 py-2"
          >
            <div
              class="w-4 h-4 rounded-full flex-shrink-0"
              :style="{ backgroundColor: stat.category.color }"
            ></div>
            <div class="flex-1 flex items-center justify-between">
              <span class="text-sm text-gray-700">{{ stat.category.icon }} {{ stat.category.name }}</span>
              <span class="text-sm font-semibold text-gray-800">{{ stat.amount.toLocaleString('ru-RU') }} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MonthSelector v-model:currentDate="currentDate" />

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
      <Button
        icon="pi pi-plus"
        label="Добавить расход"
        severity="primary"
        size="large"
        @click="navigateToCreateTransaction"
        class="w-full shadow-lg"
      />
    </div>
  </div>
</template>
