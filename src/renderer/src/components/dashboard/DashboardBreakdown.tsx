import BreakdownChart from "@/components/BreakdownChart";
import { TrendChart } from "@/components/TrendChart";
import type { BreakdownType } from "@/hooks/useDashboardFilters";

interface Props {
  fullMonthlyTotal: MonthlyTotal[];
  categoryBreakdown: CategoryPercentage[] | null;
  categoryBreakdownType: BreakdownType;
  displayIncomeChart: boolean;
  displayExpenseChart: boolean;
}

function DashboardBreakdown({
  fullMonthlyTotal,
  categoryBreakdown,
  categoryBreakdownType,
  displayIncomeChart,
  displayExpenseChart,
}: Props): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 overflow-visible">
      <div className="lg:col-span-2">
        <TrendChart
          data={fullMonthlyTotal}
          displayIncomeChart={displayIncomeChart}
          displayExpenseChart={displayExpenseChart}
        />
      </div>
      <div className="lg:col-span-1">
        <BreakdownChart
          data={categoryBreakdown}
          transactionType={categoryBreakdownType}
        />
      </div>
    </div>
  );
}

export default DashboardBreakdown;
