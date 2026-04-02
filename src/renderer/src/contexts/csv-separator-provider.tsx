import { useState } from 'react'
import { CSV_SEPARATORS } from '@/constants/csv-separators'
import { CsvSeparatorContext, CsvSeparatorState } from '@/contexts/csv-separator-context'

type CsvSeparatorProviderProps = {
  children: React.ReactNode
  defaultSeparator?: string
  storageKey?: string
}

export function CsvSeparatorProvider({
  children,
  defaultSeparator = ',',
  storageKey = 'reledger-csv-separator',
  ...props
}: CsvSeparatorProviderProps): React.JSX.Element {
  const [csvSeparator, setCsvSeparatorState] = useState<string>(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const found = CSV_SEPARATORS.find((s) => s === stored)
      return found || CSV_SEPARATORS[0]
    }
    return CSV_SEPARATORS.find((s) => s === defaultSeparator) || CSV_SEPARATORS[0]
  })

  const setCsvSeparator = (separator: string): void => {
    localStorage.setItem(storageKey, separator)
    setCsvSeparatorState(separator)
  }

  const value: CsvSeparatorState = {
    csvSeparator,
    setCsvSeparator
  }

  return (
    <CsvSeparatorContext.Provider {...props} value={value}>
      {children}
    </CsvSeparatorContext.Provider>
  )
}
