<script setup lang="ts">
import { ref, computed, nextTick, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import {
  useCategoriesQuery,
} from '@/modules/categories/composables/useCategories'
import { useCreateTransactionMutation } from '@/modules/transactions/composables/useTransactions'
import { Category } from '@/modules/categories/adapters/Category.ts'
import { Routes } from '@/router/routes'

const router = useRouter()
const openDrawer = inject<() => void>('openDrawer')

const { data: categories, isLoading } = useCategoriesQuery()
const { mutateAsync, isPending } = useCreateTransactionMutation()

const selectedCategory = ref<Category | null>(null)
const amount = ref<number | null>(null)
const amountInput = ref<any>(null)

const expenseCategories = computed(() =>
  categories.value?.filter(c => c.type === 'expenses') || []
)

const incomeCategories = computed(() =>
  categories.value?.filter(c => c.type === 'incomes') || []
)

const displayAmount = computed(() => {
  if (!amount.value) return '0'
  return amount.value.toLocaleString('ru-RU')
})

// Автоматический фокус на input при выборе категории
watch(selectedCategory, async (newCategory) => {
  if (newCategory) {
    await nextTick()
    amountInput.value?.$el?.querySelector('input')?.focus()
  }
})

const createTransaction = async () => {
  if (!selectedCategory.value || !amount.value || amount.value === 0) {
    return
  }

  try {
    await mutateAsync({
      balance: amount.value,
      categoryId: selectedCategory.value.id,
    })

    router.push({ name: Routes.TRANSACTIONS.name })
  } catch (error) {
    console.error('Failed to create transaction:', error)
  }
}

const navigateBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <Button
        icon="pi pi-bars"
        text
        rounded
        @click="openDrawer"
        aria-label="Меню"
        class="text-gray-600"
      />
      <h1 class="text-lg font-semibold text-gray-800">Новая транзакция</h1>
      <Button
        icon="pi pi-times"
        text
        rounded
        @click="navigateBack"
        aria-label="Закрыть"
        class="text-gray-600"
      />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col p-4 pb-6">
      <div class="w-full max-w-md mx-auto flex-1 flex flex-col">
        <!-- Amount Display -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div class="text-center">
            <p class="text-sm text-gray-500 mb-2">Сумма</p>
            <div v-if="!selectedCategory">
              <h2 class="text-4xl font-bold text-gray-800">
                {{ displayAmount }} ₽
              </h2>
            </div>
            <div v-else class="flex flex-col items-center gap-3">
              <p class="text-sm text-gray-600">
                {{ selectedCategory.icon }} {{ selectedCategory.name }}
              </p>
              <InputNumber
                ref="amountInput"
                v-model="amount"
                inputmode="decimal"
                :minFractionDigits="0"
                :maxFractionDigits="2"
                placeholder="0"
                @keydown.enter="createTransaction"
                :useGrouping="false"
                class="w-full text-center"
                inputClass="text-4xl font-bold text-gray-800 text-center border-0 focus:ring-0 p-0"
              />
            </div>
          </div>
        </div>

        <!-- Categories Section -->
        <div v-if="!selectedCategory" class="flex-1 overflow-y-auto">
          <div v-if="isLoading" class="flex items-center justify-center h-40">
            <i class="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
          </div>

          <div v-else>
            <!-- Expense Categories -->
            <div v-if="expenseCategories.length > 0" class="mb-6">
              <h3 class="text-sm font-semibold text-gray-600 mb-3 px-2">Расходы</h3>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="category in expenseCategories"
                  :key="category.id"
                  @click="selectedCategory = category"
                  class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
                >
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    :style="{ backgroundColor: category.color }"
                  >
                    {{ category.icon }}
                  </div>
                  <span class="text-xs text-gray-700 text-center font-medium">{{ category.name }}</span>
                </button>
              </div>
            </div>

            <!-- Income Categories -->
            <div v-if="incomeCategories.length > 0">
              <h3 class="text-sm font-semibold text-gray-600 mb-3 px-2">Доходы</h3>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="category in incomeCategories"
                  :key="category.id"
                  @click="selectedCategory = category"
                  class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2"
                >
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    :style="{ backgroundColor: category.color }"
                  >
                    {{ category.icon }}
                  </div>
                  <span class="text-xs text-gray-700 text-center font-medium">{{ category.name }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div v-else class="flex-1 flex flex-col justify-end">
          <div class="grid grid-cols-2 gap-3">
            <Button
              label="Назад"
              severity="secondary"
              @click="selectedCategory = null; amount = null"
              class="w-full"
              size="large"
            />
            <Button
              label="Сохранить"
              severity="primary"
              @click="createTransaction"
              :disabled="!amount || amount === 0 || isPending"
              :loading="isPending"
              class="w-full"
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
