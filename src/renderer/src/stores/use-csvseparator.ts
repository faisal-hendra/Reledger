import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CsvSeparatorState = {
  csvSeparator: string
  setCsvSeparator: (separator: string) => void
}

export const useCsvSeparator = create<CsvSeparatorState>()(
  persist(
    (set) => ({
      csvSeparator: ',',
      setCsvSeparator: (separator: string) => set({ csvSeparator: separator })
    }),
    { name: 'reledger-csv-separator' }
  )
)
