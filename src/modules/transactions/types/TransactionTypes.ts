export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: string
  description?: string
  date: string
  createdAt: string
}

export interface CreateTransactionData {
  amount: number
  type: TransactionType
  category: string
  description?: string
  date: string
}

export interface UpdateTransactionData {
  amount?: number
  type?: TransactionType
  category?: string
  description?: string
  date?: string
}


