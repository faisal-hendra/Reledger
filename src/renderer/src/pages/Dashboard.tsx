import RecentTransactions from "@/components/RecentTransactions";
import WelcomeMessage from "@/components/WelcomeMessage";
import QuickStats from "@/components/QuickStats";
import DashboardBreakdown from "@/components/dashboard/DashboardBreakdown";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";

interface Props {
  // for platform specific-styling (via rust invoke)
  platform: string;
}

function Dashboard({ platform }: Props): React.JSX.Element {
  const filters = useDashboardFilters();
  const data = useDashboardData(filters);

  if (data.isTransactionEmpty === null) return <></>;
  // First-time user with no transactions
  if (data.isTransactionEmpty) return <WelcomeMessage />;

  return (
    <>
      <DashboardHeader filters={filters} />
      <div
        className={`space-y-6 flex-1 overflow-auto p-4 ${
          platform === "win32" &&
          "hover:scrollbar-thumb-[#4b4e52] scrollbar-active:scrollbar-thumb-[#696E78] h-32 scrollbar"
        }`}
      >
        <DashboardSummary
          thisMonthTotal={data.thisMonthTotal}
          lastMonthTotal={data.lastMonthTotal}
        />

        <DashboardBreakdown
          fullMonthlyTotal={data.fullMonthlyTotal}
          categoryBreakdown={data.categoryBreakdown}
          categoryBreakdownType={filters.transactionType}
          displayIncomeChart={filters.displayIncomeChart}
          displayExpenseChart={filters.displayExpenseChart}
        />

        {data.thisMonthTransactions && (
          <div className="pt-4">
            <QuickStats
              transactions={data.thisMonthTransactions}
              thisMonthTotal={data.thisMonthTotal}
              topIncome={data.topIncome}
              topExpense={data.topExpense}
            />
          </div>
        )}

        <div className="pt-4">
          <RecentTransactions recentTransactions={data.recentTransactions} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
