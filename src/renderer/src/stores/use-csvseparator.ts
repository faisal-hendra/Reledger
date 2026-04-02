import { useContext } from 'react'
import { CsvSeparatorState, CsvSeparatorContext } from '@/contexts/csv-separator-context'

export const useCsvSeparator = (): CsvSeparatorState => {
  const context = useContext(CsvSeparatorContext)
  if (context === undefined) {
    throw new Error('useCsvSeparator must be used within a CsvSeparatorProvider')
  }
  return context
}
