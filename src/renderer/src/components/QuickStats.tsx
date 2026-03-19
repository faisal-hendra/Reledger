import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { TrendingDown, TrendingUp, Receipt } from 'lucide-react'
import { useCurrency } from '@/components/ui/use-currency'
import dayjs from 'dayjs'
import { useMemo } from 'react'

interface Props {
  transactions: Transaction[]
  thisMonthTotal: MonthlyTotal
  topCategory?: CategoryPercentage
}

function QuickStats({ transactions, thisMonthTotal, topCategory }: Props): React.JSX.Element {
  const { currency } = useCurrency()

  const stats = useMemo(() => {
    const formatCurrency = (amount: number): string => {
      return `${currency.symbol}${
        amount?.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) ?? '0.00'
      }`
    }

    return {
      transactionCount: transactions?.length || 0,
      // Calculate average daily expense by dividing monthly total by current day of month
      avgDailyExpense: thisMonthTotal
        ? formatCurrency(thisMonthTotal.expense / dayjs().date())
        : '0.00',
      topCategory: topCategory?.category || 'N/A'
    }
  }, [transactions, thisMonthTotal, topCategory, currency.symbol])

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Receipt className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-xl font-semibold">{stats.transactionCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <TrendingDown className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-sm text-muted-foreground">Avg. Daily Expense</p>
              <p className="text-xl font-semibold">{stats.avgDailyExpense}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <p className="text-xl font-semibold">{stats.topCategory}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickStats
