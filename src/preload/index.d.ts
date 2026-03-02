import { ElectronAPI } from '@electron-toolkit/preload'
import { Transaction, TransactionFilters } from '../db/database'

declare global {
  interface Window {
    electron: ElectronAPI
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

export {}
