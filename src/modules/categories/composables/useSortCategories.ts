import type { Category } from '@/modules/categories/adapters/Category.ts'
import { useStorage } from '@vueuse/core'
import { uniqBy } from 'lodash-es'


export const useSortCategories = (categories: Category[]) => {
    const categoriesSaved = useStorage('categories-sorted', categories)

    categoriesSaved.value = uniqBy([...categoriesSaved.value, ...categories], 'id')

    return categoriesSaved
}
