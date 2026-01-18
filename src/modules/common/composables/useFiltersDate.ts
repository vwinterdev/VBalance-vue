import { computed, ref } from "vue"

const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

  
export const useFiltersDate = () => {
    const currentDate = ref(new Date())
    const currentMonth = computed(() => months[currentDate.value.getMonth()])
    const currentYear = computed(() => currentDate.value.getFullYear())

    const filters = computed(() => ({
        month: currentDate.value.getMonth() + 1,
        year: currentDate.value.getFullYear()
    }))

    const filtersNow = computed(() => ({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    }))

    return {
        currentDate,
        currentMonth,
        currentYear,
        filters,
        filtersNow
    }
}   