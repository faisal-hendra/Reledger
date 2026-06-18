export const handleCSVExport = (transactions: Transaction[], csvSeparator: string): void => {
  const csvContent = [
    ['Date', 'Name', 'Amount', 'Category', 'Type'],
    ...transactions.map((t) => [t.date, t.name, t.amount, t.category, t.transaction_type])
  ]
    .map((row) => row.join(csvSeparator))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}
