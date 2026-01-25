<script setup lang="ts">
import { ref, computed, nextTick, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'
import {
  useCategoriesQuery,
} from '@/modules/categories/composables/useCategories'
import { useCreateTransactionMutation } from '@/modules/transactions/composables/useTransactions'
import { Category } from '@/modules/categories/adapters/Category.ts'
import { Routes } from '@/router/routes'

const router = useRouter()
const route = useRoute()
const openDrawer = inject<() => void>('openDrawer')

const walletId = computed(() => {
  const id = route.query.walletId
  return id ? parseInt(id as string) : undefined
})

const { data: categories, isLoading, error: categoriesError } = useCategoriesQuery(walletId.value)
const { mutateAsync, isPending } = useCreateTransactionMutation()

const selectedCategory = ref<Category | null>(null)
const amount = ref<number | null>(null)
const amountInput = ref<any>(null)
const errorMessage = ref<string | null>(null)
const transactionType = ref<'income' | 'expense' | null>(null) // Тип транзакции (доход/расход)

const expenseCategories = computed(() =>
  categories.value?.filter(c => c.type === 'expenses') || []
)

const incomeCategories = computed(() =>
  categories.value?.filter(c => c.type === 'incomes') || []
)

const mixedCategories = computed(() =>
  categories.value?.filter(c => c.type === 'mixed') || []
)

// Всегда сбрасываем тип транзакции при выборе категории
watch(selectedCategory, (newCategory) => {
  if (newCategory) {
    transactionType.value = null // Всегда нужно выбрать тип транзакции
    nextTick(() => {
      amountInput.value?.$el?.querySelector('input')?.focus()
    })
  } else {
    transactionType.value = null
  }
})

const displayAmount = computed(() => {
  if (!amount.value) return '0'
  return amount.value.toLocaleString('ru-RU')
})

const createTransaction = async () => {
  errorMessage.value = null
  
  if (!selectedCategory.value || !amount.value || amount.value === 0) {
    errorMessage.value = 'Выберите категорию и введите сумму'
    return
  }

  // Всегда нужно выбрать тип транзакции
  if (!transactionType.value) {
    errorMessage.value = 'Выберите тип транзакции (доход или расход)'
    return
  }

  if (!walletId.value) {
    errorMessage.value = 'Кошелек не выбран. Перенаправление...'
    setTimeout(() => {
      router.push({ name: Routes.HOME.name })
    }, 1500)
    return
  }

  try {
    // Если это расход, умножаем на -1
    const balance = transactionType.value === 'expense' 
      ? -Math.abs(amount.value) 
      : Math.abs(amount.value)

    await mutateAsync({
      balance: balance,
      categoryId: selectedCategory.value.id,
      walletId: walletId.value,
    })

    // Возвращаемся на страницу кошелька
    router.push({ name: Routes.WALLET_DETAIL.name, params: { id: walletId.value } })
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.error || error?.message || 'Ошибка при создании транзакции'
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
              <p v-if="transactionType" class="text-xs text-gray-500">
                {{ transactionType === 'income' ? 'Доход' : 'Расход' }}
              </p>
              <InputNumber
                ref="amountInput"
                v-model="amount"
                inputmode="decimal"
                :min="0"
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

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4">
          <Message severity="error" :closable="false">
            {{ errorMessage }}
          </Message>
        </div>

        <!-- Wallet ID Warning -->
        <div v-if="!walletId" class="mb-4">
          <Message severity="warn" :closable="false">
            Кошелек не выбран. Выберите кошелек для создания транзакции.
          </Message>
        </div>

        <!-- Categories Section -->
        <div v-if="!selectedCategory" class="flex-1 overflow-y-auto">
          <div v-if="isLoading" class="flex items-center justify-center h-40">
            <i class="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
          </div>

          <div v-else-if="categoriesError" class="flex flex-col items-center justify-center h-40 text-gray-500">
            <i class="pi pi-exclamation-triangle text-4xl mb-2"></i>
            <p class="text-sm">Ошибка загрузки категорий</p>
          </div>

          <div v-else-if="!categories || (expenseCategories.length === 0 && incomeCategories.length === 0 && mixedCategories.length === 0)" class="flex flex-col items-center justify-center h-40 text-gray-500">
            <i class="pi pi-tag text-4xl mb-2"></i>
            <p class="text-sm font-medium mb-1">Нет категорий</p>
            <p class="text-xs text-center px-4">Создайте категории для этого кошелька</p>
            <Button
              v-if="walletId"
              label="Создать категорию"
              size="small"
              severity="secondary"
              outlined
              @click="router.push({ name: Routes.CATEGORIES.name, query: { walletId: walletId } })"
              class="mt-3"
            />
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
            <div v-if="incomeCategories.length > 0" class="mb-6">
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

            <!-- Mixed Categories -->
            <div v-if="mixedCategories.length > 0">
              <h3 class="text-sm font-semibold text-gray-600 mb-3 px-2">Смешанные</h3>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="category in mixedCategories"
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

        <!-- Transaction Type Selection (всегда показываем для любой категории) -->
        <div v-if="selectedCategory && !transactionType" class="mb-4">
          <div class="bg-white rounded-lg shadow-sm p-4">
            <p class="text-sm font-semibold text-gray-700 mb-3">Выберите тип транзакции</p>
            <div class="grid grid-cols-2 gap-3">
              <Button
                label="Доход"
                icon="pi pi-arrow-up"
                severity="success"
                :outlined="transactionType !== 'income'"
                @click="transactionType = 'income'"
                class="w-full"
                size="large"
              />
              <Button
                label="Расход"
                icon="pi pi-arrow-down"
                severity="danger"
                :outlined="transactionType !== 'expense'"
                @click="transactionType = 'expense'"
                class="w-full"
                size="large"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="selectedCategory && transactionType" class="flex-1 flex flex-col justify-end gap-3">
          <div v-if="errorMessage" class="mb-2">
            <Message severity="error" :closable="false">
              {{ errorMessage }}
            </Message>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <Button
              label="Назад"
              severity="secondary"
              @click="selectedCategory = null; amount = null; transactionType = null; errorMessage = null"
              class="w-full"
              size="large"
            />
            <Button
              label="Сохранить"
              severity="primary"
              @click="createTransaction"
              :disabled="!amount || amount === 0 || isPending || !walletId || !transactionType"
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
