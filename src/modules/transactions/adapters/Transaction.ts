import type { Raw } from '@/modules/common/types/Raw.ts'

export class Transaction {
  id: number
  balance: number
  categoryId: number
  isPositive: boolean
  createdAt: string

  constructor(raw: Raw) {
    this.id = raw.id
    this.balance = raw.balance
    this.categoryId = raw.category_id || raw.categoryId
    this.isPositive = raw.is_positive || raw.isPositive
    this.createdAt = raw.created_at || raw.createdAt
  }

  static fromRaw(raw: Raw): Transaction {
    return new Transaction(raw)
  }
}
