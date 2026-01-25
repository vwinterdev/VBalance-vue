import type { Raw } from '@/modules/common/types/Raw.ts'
import { Category } from '@/modules/categories/adapters/Category.ts'

export class Transaction {
  id: number
  balance: number
  categoryId: number
  isPositive: boolean
  createdAt: string
  category?: Category

  constructor(raw: Raw) {
    this.id = raw.id
    this.balance = raw.balance
    this.categoryId = raw.category_id || raw.categoryId
    this.isPositive = raw.is_positive || raw.isPositive
    this.createdAt = raw.created_at || raw.createdAt
    
    // Если категория пришла с транзакцией, создаем объект Category
    if (raw.category) {
      this.category = new Category({
        id: raw.category.id,
        name: raw.category.name,
        icon: raw.category.icon,
        color: raw.category.color,
        second_color: raw.category.secondColor || raw.category.second_color,
        type: raw.category.type
      })
    }
  }

  static fromRaw(raw: Raw): Transaction {
    return new Transaction(raw)
  }
}
