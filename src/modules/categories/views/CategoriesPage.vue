<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCategoriesQuery } from '../composables/useCategories'
import { useWalletQuery } from '@/modules/wallet/composables/useWallets'
import CategoriesList from '../components/CategoriesList.vue'
import CreateCategoryDialog from '../components/CreateCategoryDialog.vue'
import { Category } from '../adapters/Category'

const router = useRouter()
const route = useRoute()
const showCreateDialog = ref(false)
const openDrawer = inject<() => void>('openDrawer')

const walletId = computed(() => {
  const id = route.query.walletId
  return id ? parseInt(id as string) : undefined
})

const { data: categories, isLoading, error: categoriesError } = useCategoriesQuery(walletId.value)
const { data: wallet, isLoading: isLoadingWallet } = useWalletQuery(computed(() => walletId.value ?? 0))

const handleAddCategory = () => {
  showCreateDialog.value = true
}

const handleSelectCategory = (category: Category) => {
  console.log('Selected category:', category)
}

const goBack = () => {
  router.back()
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
      <h1 class="text-lg font-semibold text-gray-800">Категории</h1>
      <Button
        icon="pi pi-arrow-left"
        text
        rounded
        @click="goBack"
        aria-label="Назад"
        class="text-gray-600"
      />
    </div>

    <!-- Wallet Info (if walletId is provided) -->
    <div v-if="walletId && wallet" class="bg-white px-4 py-3 border-b">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          :style="{ backgroundColor: wallet.color }"
        >
          {{ wallet.icon }}
        </div>
        <div>
          <p class="text-sm text-gray-500">Категории кошелька</p>
          <p class="font-semibold text-gray-800">{{ wallet.name }}</p>
        </div>
      </div>
    </div>

    <!-- Warning if no walletId -->
    <div v-if="!walletId" class="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <Message severity="info" :closable="false">
        Показаны категории всех ваших кошельков. Для создания категории выберите кошелек.
      </Message>
    </div>

    <div class="flex-1 p-6">
      <div v-if="isLoading || isLoadingWallet" class="flex items-center justify-center h-64">
        <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
      </div>

      <div v-else-if="categoriesError" class="flex flex-col items-center justify-center h-64 text-gray-500">
        <i class="pi pi-exclamation-triangle text-4xl mb-2"></i>
        <p class="text-sm">Ошибка загрузки категорий</p>
      </div>

      <div v-else-if="!categories || categories.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500">
        <i class="pi pi-tag text-6xl mb-4"></i>
        <p class="text-lg font-medium mb-1">Нет категорий</p>
        <p class="text-sm text-center px-4 mb-4">
          <span v-if="walletId">Создайте первую категорию для этого кошелька</span>
          <span v-else>Создайте категории для ваших кошельков</span>
        </p>
        <Button
          label="Создать категорию"
          icon="pi pi-plus"
          @click="handleAddCategory"
        />
      </div>

      <CategoriesList
        v-else
        :categories="categories"
        :is-loading="isLoading"
        @add-category="handleAddCategory"
        @select-category="handleSelectCategory"
      />
    </div>

    <CreateCategoryDialog v-model:visible="showCreateDialog" />
  </div>
</template>
