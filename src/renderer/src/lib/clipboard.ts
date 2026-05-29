import type { Currency } from '@common/types'

export const copyTransactionInfo = (transaction: Transaction, currency: Currency): void => {
  navigator.clipboard.writeText(
    `id: ${transaction.id}\n` +
      `type: ${transaction.transaction_type}\n` +
      `date: ${transaction.date}\n` +
      `name: ${transaction.name}\n` +
      `cat: ${transaction.category}\n` +
      `desc: ${transaction.description || '-'}\n` +
      `amount: ${currency.symbol}${transaction.amount}\n`
  )
}
