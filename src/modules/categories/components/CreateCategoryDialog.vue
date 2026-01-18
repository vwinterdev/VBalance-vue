<script setup lang="ts">
import { ref, computed } from 'vue'
import { ALL_EMOJIS, POPULAR_EMOJIS } from '@/modules/common/constants/emojis'
import { useCreateCategoryMutation } from '../composables/useCategories'

const visible = defineModel<boolean>('visible', { default: false })

const categoryName = ref('')
const selectedEmoji = ref('🍔')
const selectedColor = ref('#6366f1')
const selectedSecondColor = ref('#8b5cf6')
const selectedType = ref<'expenses' | 'incomes'>('expenses')
const showAllEmojis = ref(false)

const { mutateAsync, isPending } = useCreateCategoryMutation()

const colors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444',
  '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6'
]

const displayedEmojis = computed(() => {
  return showAllEmojis.value ? ALL_EMOJIS : POPULAR_EMOJIS
})

const handleSave = async () => {
  if (!categoryName.value) return

  try {
    await mutateAsync({
      name: categoryName.value,
      icon: selectedEmoji.value,
      color: selectedColor.value,
      secondColor: selectedSecondColor.value,
      type: selectedType.value
    })

    categoryName.value = ''
    selectedEmoji.value = '🍔'
    selectedColor.value = '#6366f1'
    selectedSecondColor.value = '#8b5cf6'
    selectedType.value = 'expenses'
    showAllEmojis.value = false

    visible.value = false
  } catch (error) {
    console.error('Failed to create category:', error)
  }
}

const toggleEmojiView = () => {
  showAllEmojis.value = !showAllEmojis.value
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Новая категория"
    :style="{ width: '32rem' }"
    :breakpoints="{ '640px': '95vw' }"
    position="bottom"
  >
    <div class="flex flex-col gap-6 py-2">
      <div class="flex justify-center">
        <div class="flex flex-col items-center gap-2">
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg"
            
          >
            {{ selectedEmoji }}
          </div>
          <span v-if="categoryName" class="text-sm font-medium text-gray-700">{{ categoryName }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="name" class="font-semibold text-sm text-gray-700">Название</label>
        <InputText
          id="name"
          v-model="categoryName"
          placeholder="Введите название"
          class="w-full"
          autofocus
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-semibold text-sm text-gray-700">Тип</label>
        <div class="grid grid-cols-2 gap-2">
          <Button
            label="Расход"
            :severity="selectedType === 'expenses' ? 'danger' : 'secondary'"
            :outlined="selectedType !== 'expenses'"
            @click="selectedType = 'expenses'"
            class="flex-1"
          />
          <Button
            label="Доход"
            :severity="selectedType === 'incomes' ? 'success' : 'secondary'"
            :outlined="selectedType !== 'incomes'"
            @click="selectedType = 'incomes'"
            class="flex-1"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label class="font-semibold text-sm text-gray-700">Иконка</label>
          <Button
            :label="showAllEmojis ? 'Показать популярные' : 'Показать все'"
            text
            size="small"
            @click="toggleEmojiView"
            class="text-xs"
          />
        </div>
        <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div class="grid grid-cols-8 gap-1">
            <button
              v-for="emoji in displayedEmojis"
              :key="emoji"
              type="button"
              class="aspect-square flex items-center justify-center text-2xl rounded-lg hover:bg-gray-100 transition-colors"
              :class="{ 'bg-blue-50 ring-2 ring-blue-500': selectedEmoji === emoji }"
              @click="selectedEmoji = emoji"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-semibold text-sm text-gray-700">Основной цвет</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in colors"
            :key="color"
            type="button"
            class="w-10 h-10 rounded-full transition-transform hover:scale-110"
            :class="{ 'ring-2 ring-offset-2 ring-gray-800': selectedColor === color }"
            :style="{ backgroundColor: color }"
            @click="selectedColor = color"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-semibold text-sm text-gray-700">Второй цвет (градиент)</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in colors"
            :key="color"
            type="button"
            class="w-10 h-10 rounded-full transition-transform hover:scale-110"
            :class="{ 'ring-2 ring-offset-2 ring-gray-800': selectedSecondColor === color }"
            :style="{ backgroundColor: color }"
            @click="selectedSecondColor = color"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 w-full">
        <Button
          label="Отмена"
          severity="secondary"
          outlined
          @click="visible = false"
          :disabled="isPending"
          class="flex-1"
        />
        <Button
          label="Создать"
          @click="handleSave"
          :disabled="!categoryName || isPending"
          :loading="isPending"
          class="flex-1"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-dialog) {
  max-height: 90vh;
  overflow: hidden;
}

:deep(.p-dialog-content) {
  overflow-y: auto;
}

@media (max-width: 640px) {
  :deep(.p-dialog) {
    margin: 0;
    width: 100% !important;
    max-height: 85vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
