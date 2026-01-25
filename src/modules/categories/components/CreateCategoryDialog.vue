<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ALL_EMOJIS, POPULAR_EMOJIS } from '@/modules/common/constants/emojis'
import { useCreateCategoryMutation } from '../composables/useCategories'
import { useWalletsQuery } from '@/modules/wallet/composables/useWallets'

const visible = defineModel<boolean>('visible', { default: false })
const route = useRoute()

const walletIdFromQuery = computed(() => {
  const id = route.query.walletId
  return id ? parseInt(id as string) : undefined
})

const selectedWalletId = ref<number | undefined>(walletIdFromQuery.value)
const categoryName = ref('')
const selectedEmoji = ref('🍔')
const selectedColor = ref('#6366f1')
const selectedSecondColor = ref('#8b5cf6')
const selectedType = ref<'expenses' | 'incomes' | 'mixed'>('expenses')
const showAllEmojis = ref(false)
const errorMessage = ref<string | null>(null)

const { mutateAsync, isPending } = useCreateCategoryMutation()
const { data: wallets } = useWalletsQuery()

const walletId = computed(() => selectedWalletId.value || walletIdFromQuery.value)

const colors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444',
  '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6'
]

const displayedEmojis = computed(() => {
  return showAllEmojis.value ? ALL_EMOJIS : POPULAR_EMOJIS
})

const handleSave = async () => {
  errorMessage.value = null
  
  if (!categoryName.value.trim()) {
    errorMessage.value = 'Введите название категории'
    return
  }
  
  if (!walletId.value) {
    errorMessage.value = 'Выберите кошелек для категории'
    return
  }

  try {
    await mutateAsync({
      name: categoryName.value.trim(),
      icon: selectedEmoji.value,
      color: selectedColor.value,
      secondColor: selectedSecondColor.value,
      type: selectedType.value,
      walletId: walletId.value
    })

    categoryName.value = ''
    selectedEmoji.value = '🍔'
    selectedColor.value = '#6366f1'
    selectedSecondColor.value = '#8b5cf6'
    selectedType.value = 'expenses'
    showAllEmojis.value = false
    errorMessage.value = null

    visible.value = false
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.error || error?.message || 'Ошибка при создании категории'
    console.error('Failed to create category:', error)
  }
}

// Сбрасываем выбранный кошелек при закрытии диалога, если он был из query
watch(visible, (newValue) => {
  if (!newValue) {
    selectedWalletId.value = walletIdFromQuery.value
    errorMessage.value = null
  }
})

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
      <!-- Error Message -->
      <Message v-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>

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

      <!-- Wallet Selection (if not in query) -->
      <div v-if="!walletIdFromQuery && wallets && wallets.length > 0" class="flex flex-col gap-2">
        <label for="wallet" class="font-semibold text-sm text-gray-700">Кошелек</label>
        <Select
          id="wallet"
          v-model="selectedWalletId"
          :options="wallets"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите кошелек"
          class="w-full"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ slotProps.option.icon }}</span>
              <span>{{ slotProps.option.name }}</span>
            </div>
          </template>
        </Select>
      </div>

      <div v-if="!walletIdFromQuery && (!wallets || wallets.length === 0)" class="flex flex-col gap-2">
        <Message severity="warn" :closable="false">
          У вас нет кошельков. Создайте кошелек перед созданием категории.
        </Message>
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
        <div class="grid grid-cols-3 gap-2">
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
          <Button
            label="Смешанный"
            :severity="selectedType === 'mixed' ? 'info' : 'secondary'"
            :outlined="selectedType !== 'mixed'"
            @click="selectedType = 'mixed'"
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
          :disabled="!categoryName || isPending || !walletId"
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
