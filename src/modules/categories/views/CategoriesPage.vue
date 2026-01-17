<script setup lang="ts">
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useCategoriesQuery } from '../composables/useCategories'
import CategoriesList from '../components/CategoriesList.vue'
import CreateCategoryDialog from '../components/CreateCategoryDialog.vue'
import { Category } from '../adapters/Category'

const router = useRouter()
const { data: categories, isLoading } = useCategoriesQuery()
const showCreateDialog = ref(false)
const openDrawer = inject<() => void>('openDrawer')

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

    <div class="flex-1 p-6">
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
      </div>

      <CategoriesList
        v-else-if="categories"
        :categories="categories"
        :is-loading="isLoading"
        @add-category="handleAddCategory"
        @select-category="handleSelectCategory"
      />
    </div>

    <CreateCategoryDialog v-model:visible="showCreateDialog" />
  </div>
</template>
