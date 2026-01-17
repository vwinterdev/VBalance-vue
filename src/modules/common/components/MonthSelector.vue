<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

const props = withDefaults(defineProps<{
  currentDate: Date
  position?: 'fixed' | 'static'
}>(), {
  position: 'fixed'
})

const emit = defineEmits<{
  'update:currentDate': [date: Date]
}>()

const shortMonths = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
]

const previousMonth = () => {
  const newDate = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() - 1)
  emit('update:currentDate', newDate)
}

const nextMonth = () => {
  const newDate = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1)
  const today = new Date()

  // Не позволяем переключиться на будущий месяц
  if (newDate.getFullYear() > today.getFullYear() ||
      (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() > today.getMonth())) {
    return
  }

  emit('update:currentDate', newDate)
}

const canGoNext = computed(() => {
  const today = new Date()
  const nextDate = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1)

  return nextDate.getFullYear() < today.getFullYear() ||
         (nextDate.getFullYear() === today.getFullYear() && nextDate.getMonth() <= today.getMonth())
})

const getMonthsForCarousel = () => {
  const today = new Date()
  const result = []

  for (let i = -2; i <= 2; i++) {
    const date = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + i, 1)

    // Пропускаем будущие месяцы
    if (date.getFullYear() > today.getFullYear() ||
        (date.getFullYear() === today.getFullYear() && date.getMonth() > today.getMonth())) {
      continue
    }

    result.push({
      month: date.getMonth(),
      year: date.getFullYear(),
      label: shortMonths[date.getMonth()],
      offset: i
    })
  }
  return result
}

const monthsCarousel = computed(() => getMonthsForCarousel())

const selectMonth = (offset: number) => {
  const newDate = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + offset, 1)
  emit('update:currentDate', newDate)
}
</script>

<template>
  <div
    :class="[
      position === 'fixed' ? 'fixed bottom-20 left-0 right-0' : '',
      'bg-white border-t border-gray-200 px-4 py-3'
    ]"
  >
    <div class="max-w-md mx-auto flex items-center justify-center gap-2">
      <Button
        icon="pi pi-chevron-left"
        text
        rounded
        @click="previousMonth"
        size="small"
        class="text-gray-600"
      />
      <div class="flex gap-1">
        <button
          v-for="item in monthsCarousel"
          :key="`${item.year}-${item.month}`"
          @click="selectMonth(item.offset)"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
            item.offset === 0
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ item.label }}
        </button>
      </div>
      <Button
        icon="pi pi-chevron-right"
        text
        rounded
        @click="nextMonth"
        :disabled="!canGoNext"
        size="small"
        class="text-gray-600"
      />
    </div>
  </div>
</template>
