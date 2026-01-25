<!-- vue/src/modules/wallet/components/CreateWalletDialog.vue -->

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useCreateWalletMutation } from '../composables/useWallets'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { mutateAsync, isPending } = useCreateWalletMutation()

// Zod схема
const walletSchema = z.object({
  name: z
    .string({ error: 'Введите название' })
    .min(2, 'Минимум 2 символа')
    .max(50, 'Максимум 50 символов'),
  currency: z.string().length(3).default('RUB'),
  icon: z.string().max(10).default('💰'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#4CAF50')
})

const form = reactive({
  name: '',
  currency: 'RUB',
  icon: '💰',
  color: '#4CAF50'
})

const errorMessage = ref('')
const fieldErrors = reactive({
  name: ''
})

// Предустановленные иконки
const availableIcons = ['💰', '💳', '🏦', '💵', '💴', '💶', '💷', '🪙', '💸', '🤑']
const availableColors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4']

const handleSubmit = async () => {
  errorMessage.value = ''
  fieldErrors.name = ''

  const validation = walletSchema.safeParse(form)

  if (!validation.success) {
    validation.error.issues.forEach((error) => {
      const field = error.path[0] as keyof typeof fieldErrors
      if (field in fieldErrors) {
        fieldErrors[field] = error.message
      }
    })
    errorMessage.value = validation.error.issues?.[0]?.message || 'Ошибка создания кошелька'
    return
  }

  try {
    await mutateAsync(validation.data)
    
    emit('update:visible', false)
    form.name = ''
    form.currency = 'RUB'
    form.icon = '💰'
    form.color = '#4CAF50'
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Ошибка создания кошелька'
  }
}

const closeDialog = () => {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="props.visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Создать новый кошелек"
    :style="{ width: '32rem' }"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <!-- Name -->
      <div class="flex flex-col gap-2">
        <label for="name" class="font-semibold">Название</label>
        <InputText
          id="name"
          v-model="form.name"
          placeholder="Личный кошелек"
          :invalid="!!fieldErrors.name"
          :disabled="isPending"
          fluid
        />
        <small v-if="fieldErrors.name" class="text-red-500">
          {{ fieldErrors.name }}
        </small>
      </div>

      <!-- Currency -->
      <div class="flex flex-col gap-2">
        <label for="currency" class="font-semibold">Валюта</label>
        <Select
          id="currency"
          v-model="form.currency"
          :options="[
            { label: 'RUB - Российский рубль', value: 'RUB' },
            { label: 'USD - Доллар США', value: 'USD' },
            { label: 'EUR - Евро', value: 'EUR' }
          ]"
          optionLabel="label"
          optionValue="value"
          :disabled="isPending"
          fluid
        />
      </div>

      <!-- Icon -->
      <div class="flex flex-col gap-2">
        <label class="font-semibold">Иконка</label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="icon in availableIcons"
            :key="icon"
            type="button"
            class="w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl transition-colors"
            :class="form.icon === icon ? 'border-primary' : 'border-gray-300 dark:border-gray-600'"
            @click="form.icon = icon"
            :disabled="isPending"
          >
            {{ icon }}
          </button>
        </div>
      </div>

      <!-- Color -->
      <div class="flex flex-col gap-2">
        <label class="font-semibold">Цвет</label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="color in availableColors"
            :key="color"
            type="button"
            class="w-12 h-12 rounded-lg border-2 transition-colors"
            :class="form.color === color ? 'border-primary border-4' : 'border-gray-300 dark:border-gray-600'"
            :style="{ backgroundColor: color }"
            @click="form.color = color"
            :disabled="isPending"
          />
        </div>
      </div>

      <!-- Error Message -->
      <Message v-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>
    </form>

    <template #footer>
      <Button
        label="Отмена"
        severity="secondary"
        @click="closeDialog"
        :disabled="isPending"
      />
      <Button
        label="Создать"
        @click="handleSubmit"
        :loading="isPending"
      />
    </template>
  </Dialog>
</template>
