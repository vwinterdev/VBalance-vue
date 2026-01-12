<script setup lang="ts">
import { ref } from 'vue'
import { useCategoriesQuery, useCreateCategoryMutation } from '@/modules/categories/composables/useCategories'
import type { Category } from '@/modules/categories/types/CategoryTypes'
const { data } = useCategoriesQuery()

const selectedCategory = ref<Category | null>(null)
const { mutateAsync } = useCreateCategoryMutation()
const amount = ref(0)

const createTransaction = () => {
    mutateAsync({
        balance: amount.value,
        categoryId: selectedCategory.value?.id || ''
    })
}
</script>

<template>
  <div class="min-h-screen p-4">
    <ul v-if="!selectedCategory">
        <li v-for="category in data.categories" @click="selectedCategory = category" :key="category.id">
            {{ category.name }}
        </li>
    </ul>
    <div v-else>
        <h1>{{ selectedCategory.name }}</h1>
        <input type="text" v-model="amount" />
        <button @click="createTransaction">Создать</button>
    </div>
  </div>
</template>

