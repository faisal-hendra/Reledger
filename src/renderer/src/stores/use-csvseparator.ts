import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CSV_SEPARATORS } from '@/constants/csv-separators'

type CsvSeparatorState = {
  csvSeparator: string
  setCsvSeparator: (separator: string) => void
}

export const useCsvSeparator = create<CsvSeparatorState>()(
  persist(
    (set) => ({
      csvSeparator: CSV_SEPARATORS[0],
      setCsvSeparator: (separator: string) => set({ csvSeparator: separator })
    }),
    { name: 'reledger-csv-separator' }
  )
)
