import { useState } from "react";
import dayjs from "dayjs";

export type BreakdownType = "income" | "expense";

/**
 * User-controlled filter state for the Dashboard.
 *
 * Returned in the same shape as <FilterDashboard />'s props (minus children)
 * so the orchestrator can spread the result straight into the header.
 */
export interface DashboardFilters {
  year: number;
  month: number;
  transactionType: BreakdownType;
  displayIncomeChart: boolean;
  displayExpenseChart: boolean;
  setYear: (value: number) => void;
  setMonth: (value: number) => void;
  setTransactionType: (value: BreakdownType) => void;
  setDisplayIncomeChart: (value: boolean) => void;
  setDisplayExpenseChart: (value: boolean) => void;
}

export function useDashboardFilters(): DashboardFilters {
  const [displayIncomeChart, setDisplayIncomeChart] = useState(true);
  const [displayExpenseChart, setDisplayExpenseChart] = useState(true);
  const [year, setYear] = useState(() => dayjs().year());
  const [month, setMonth] = useState(() => dayjs().month() + 1);
  const [transactionType, setTransactionType] =
    useState<BreakdownType>("expense");

  return {
    year,
    month,
    transactionType,
    displayIncomeChart,
    displayExpenseChart,
    setYear,
    setMonth,
    setTransactionType,
    setDisplayIncomeChart,
    setDisplayExpenseChart,
  };
}
