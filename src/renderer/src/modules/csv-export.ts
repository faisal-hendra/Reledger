import { saveAs } from 'file-saver'

export const handleCSVExport = (transactions: Transaction[], csvSeparator): void => {
  const csvContent = [
    ['Date', 'Name', 'Amount', 'Category', 'Type'],
    ...transactions.map((t) => [t.date, t.name, t.amount, t.category, t.transaction_type])
  ]
    .map((row) => row.join(`${csvSeparator}`))
    .join('\n')
  handleCSVDownload(csvContent)
}

const handleCSVDownload = (csv): void => {
  const file = new File([csv], 'transactions.csv', { type: 'text/csv' })
  saveAs(file)
}
