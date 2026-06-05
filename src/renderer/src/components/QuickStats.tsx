import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  TrendingDown,
  Receipt,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { useCurrency } from "@/stores/use-currency";
import { formatCurrency } from "@/lib/format-currency";
import dayjs from "dayjs";
import { useMemo } from "react";

interface Props {
  transactions: Transaction[];
  thisMonthTotal: MonthlyTotal;
  topExpense?: Transaction;
  topIncome?: Transaction;
}

function QuickStats({
  transactions,
  thisMonthTotal,
  topIncome,
  topExpense,
}: Props): React.JSX.Element {
  const { currency } = useCurrency();

  const stats = useMemo(() => {
    return {
      transactionCount: transactions?.length || 0,
      // Calculate average daily expense by dividing monthly total by current day of month
      avgDailyExpense: thisMonthTotal
        ? formatCurrency(
            thisMonthTotal.expense / dayjs().date(),
            currency.symbol,
          )
        : "0.00",
      topIncome: topIncome
        ? formatCurrency(topIncome.amount, currency.symbol)
        : "N/A",
      topExpense: topExpense
        ? formatCurrency(topExpense.amount, currency.symbol)
        : "N/A",
    };
  }, [transactions, thisMonthTotal, topIncome, topExpense, currency.symbol]);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Receipt className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-xl font-semibold">{stats.transactionCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">Top Income</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold">
                  {topIncome?.name ?? "N/A"}
                  {topIncome?.name && (
                    <span className="text-muted-foreground text-sm">
                      {` `}({stats.topIncome})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <TrendingDown className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-sm text-muted-foreground">Top Expense</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold">
                  {topExpense?.name ?? "N/A"}
                  {topExpense?.name && (
                    <span className="text-muted-foreground text-sm">
                      {` `}({stats.topExpense})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Calculator className="h-8 w-8 text-orange-400" />
            <div>
              <p className="text-sm text-muted-foreground">
                Avg. Daily Expense
              </p>
              <p className="text-xl font-semibold">{stats.avgDailyExpense}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuickStats;
