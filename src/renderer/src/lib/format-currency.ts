export function formatCurrency(amount: number, symbol: string): string {
  const negative = amount < 0
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${negative ? '-' : ''}${symbol}${formatted}`
}
