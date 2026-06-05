import { FunnelIcon } from "lucide-react";
import FilterDashboard from "@/components/FilterDashboard";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import type { DashboardFilters } from "@/hooks/useDashboardFilters";

interface Props {
  filters: DashboardFilters;
}

function DashboardHeader({ filters }: Props): React.JSX.Element {
  return (
    <PageHeader>
      <FilterDashboard
        displayIncomeChart={filters.displayIncomeChart}
        displayExpenseChart={filters.displayExpenseChart}
        setDisplayIncomeChart={filters.setDisplayIncomeChart}
        setDisplayExpenseChart={filters.setDisplayExpenseChart}
        year={filters.year}
        setYear={filters.setYear}
        month={filters.month}
        setMonth={filters.setMonth}
        transactionType={filters.transactionType}
        setTransactionType={filters.setTransactionType}
      >
        <Button variant="outline">
          <FunnelIcon />
        </Button>
      </FilterDashboard>
    </PageHeader>
  );
}

export default DashboardHeader;
