import { computed, type Ref } from 'vue'
import type { Transaction } from '../adapters/Transaction'
import type { Category } from '@/modules/categories/adapters/Category'

export interface CategoryStat {
  category: Category
  amount: number
  percentage: number
  transactionCount: number
}

export const useTransactionStats = (
  transactions: Ref<Transaction[] | undefined>,
  categories: Ref<Category[] | undefined>
) => {
  const totalIncome = computed(() => {
    if (!transactions.value) return 0
    return transactions.value
      .filter(t => t.isPositive)
      .reduce((sum, t) => sum + t.balance, 0)
  })

  const totalExpense = computed(() => {
    if (!transactions.value) return 0
    return transactions.value
      .filter(t => !t.isPositive)
      .reduce((sum, t) => sum + Math.abs(t.balance), 0)
  })

  const balance = computed(() => totalIncome.value - totalExpense.value)

  const categoryStats = computed<CategoryStat[]>(() => {
    if (!transactions.value || !categories.value) return []

    const expenseTransactions = transactions.value.filter(t => !t.isPositive)
    const total = totalExpense.value

    const statsMap = new Map<number, CategoryStat>()

    for (const transaction of expenseTransactions) {
      const category = categories.value.find(c => c.id === transaction.categoryId)
      if (!category) continue

      const existing = statsMap.get(category.id)
      const amount = Math.abs(transaction.balance)

      if (existing) {
        existing.amount += amount
        existing.transactionCount += 1
      } else {
        statsMap.set(category.id, {
          category,
          amount,
          percentage: 0,
          transactionCount: 1,
        })
      }
    }

    const stats = Array.from(statsMap.values())

    for (const stat of stats) {
      stat.percentage = total > 0 ? Math.round((stat.amount / total) * 100) : 0
    }

    return stats.sort((a, b) => b.amount - a.amount)
  })

  const recentTransactions = computed(() => {
    if (!transactions.value) return []
    return [...transactions.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  })

  return {
    totalIncome,
    totalExpense,
    balance,
    categoryStats,
    recentTransactions,
  }
}
