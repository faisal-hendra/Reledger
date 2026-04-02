import { createContext } from 'react'
import { CSV_SEPARATORS } from '@/constants/csv-separators'

export type CsvSeparatorState = {
  csvSeparator: string
  setCsvSeparator: (separator: string) => void
}

const initialState: CsvSeparatorState = {
  csvSeparator: CSV_SEPARATORS[0],
  setCsvSeparator: () => null
}

export const CsvSeparatorContext = createContext<CsvSeparatorState>(initialState)
