<script setup lang="ts">
import { Category } from '../adapters/Category'
import { useSortCategories } from '@/modules/categories/composables/useSortCategories.ts'
import { useSortable } from '@vueuse/integrations/useSortable'
import { useTemplateRef } from 'vue'

const props = defineProps<{
  categories: Category[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  addCategory: []
  selectCategory: [category: Category]
}>()

const el = useTemplateRef('el')


const sortCategories = useSortCategories(props.categories)
useSortable(el, sortCategories)

</script>

<template>
  <div class="max-w-md mx-auto">
    <div class="grid grid-cols-4 gap-6">
      <div
        class="flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        @click="emit('addCategory')"
      >
        <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 shadow-md">
          <i class="pi pi-plus"></i>
        </div>
        <span class="text-xs text-center text-gray-600 max-w-[80px] truncate">Добавить</span>
      </div>

      <div
        ref="el"
        class="contents"
      >
        <div
          v-for="category in sortCategories"
          :key="category.id"
          class="flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          @click="emit('selectCategory', category)"
        >
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white shadow-md"
            :style="{
              background: `linear-gradient(135deg, ${category.color}, ${category.secondColor || category.color})`
            }"
          >
            {{ category.icon }}
          </div>
          <span class="text-xs text-center text-gray-600 max-w-[80px] truncate">{{ category.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
