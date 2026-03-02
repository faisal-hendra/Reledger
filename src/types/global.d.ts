export {}

declare global {
  interface Transaction {
    id?: number
    transaction_type: 'expense' | 'income'
    name: string
    amount: number
    category: string
    description?: string
    date: string
  }

  interface TransactionFilters {
    month: number | null
    year: number | null
    keyword: string | null
  }

  interface MonthlyTotal {
    income: number
    expense: number
  }

  interface MonthlyTotalFilters {
    month: number
    year: number
  }

  interface Window {
    api: {
      platform: string
      getTransactions: (filters: TransactionFilters) => Promise<Transaction[]>
      addTransaction: (transaction: Transaction) => Promise<void>
      deleteTransaction: (transactionId: string) => Promise<void>
      updateTransaction: (transaction: Transaction) => Promise<void>
      getRecentTransactions: (limit: number) => Promise<Transaction[] | null>
      getMonthlyTotal: (filters: MonthlyTotalFilters) => Promise<MonthlyTotal | null>
    }
  }
}
