import { useMemo } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrency } from "@/stores/use-currency";
import { formatCurrency } from "@/lib/format-currency";

interface Props {
  thisMonthTotal: MonthlyTotal;
  lastMonthTotal: MonthlyTotal;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  isExpense: boolean;
  icon: LucideIcon;
}

function calculatePercentageChange(
  current: number,
  previous: number,
): { change: string; trend: "up" | "down" } {
  if (previous === 0) {
    if (current === 0) return { change: "0%", trend: "up" };
    return { change: "+100%", trend: "up" };
  }

  const change = (current - previous) / Math.abs(previous);
  if (!isFinite(change)) return { change: "0%", trend: "down" };

  return {
    change: `${change >= 0 ? "+" : ""}${(change * 100).toFixed(1)}%`,
    trend: change >= 0 ? "up" : "down",
  };
}

function determineStatsColor(
  trend: "up" | "down",
  isExpense: boolean,
  change: string,
): string {
  if (change === "0%") return "text-positive";
  if (!isExpense) return trend === "up" ? "text-positive" : "text-destructive";
  return trend === "up" ? "text-destructive" : "text-positive";
}

function DashboardSummary({
  thisMonthTotal,
  lastMonthTotal,
}: Props): React.JSX.Element {
  const { currency } = useCurrency();

  const currentBalance = thisMonthTotal.income - thisMonthTotal.expense;
  const lastMonthBalance = lastMonthTotal.income - lastMonthTotal.expense;

  const stats = useMemo<Stat[]>(() => {
    const incomeChange = calculatePercentageChange(
      thisMonthTotal.income,
      lastMonthTotal.income,
    );
    const expenseChange = calculatePercentageChange(
      thisMonthTotal.expense,
      lastMonthTotal.expense,
    );
    const balanceChange = calculatePercentageChange(
      currentBalance,
      lastMonthBalance,
    );

    return [
      {
        label: "Balance",
        value: formatCurrency(currentBalance, currency.symbol),
        change: balanceChange.change,
        trend: balanceChange.trend,
        isExpense: false,
        icon: Wallet,
      },
      {
        label: "Income",
        value: formatCurrency(thisMonthTotal.income, currency.symbol),
        change: incomeChange.change,
        trend: incomeChange.trend,
        isExpense: false,
        icon: ArrowDownLeft,
      },
      {
        label: "Expenses",
        value: formatCurrency(thisMonthTotal.expense, currency.symbol),
        change: expenseChange.change,
        trend: expenseChange.trend,
        isExpense: true,
        icon: ArrowUpRight,
      },
    ];
  }, [
    thisMonthTotal,
    lastMonthTotal,
    currentBalance,
    lastMonthBalance,
    currency.symbol,
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow-none">
          <CardHeader>
            <CardTitle>{stat.label}</CardTitle>
            <CardAction>
              <div className="flex items-center justify-center">
                <stat.icon className="w-4 h-4" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold mb-1">{stat.value}</div>
            <div
              className={`text-xs ${determineStatsColor(stat.trend, stat.isExpense, stat.change)}`}
            >
              {stat.change} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DashboardSummary;
