import { useEffect, useMemo, useState } from "react";
import { BIG_NUMBER } from "@/constants/bignumber";
import type { DashboardFilters } from "./useDashboardFilters";

export interface DashboardData {
  /** null = initial load not yet complete, true = no transactions, false = has data. */
  isTransactionEmpty: boolean | null;
  fullMonthlyTotal: MonthlyTotal[];
  thisMonthTotal: MonthlyTotal;
  lastMonthTotal: MonthlyTotal;
  categoryBreakdown: CategoryPercentage[] | null;
  thisMonthTransactions: Transaction[] | undefined;
  recentTransactions: Transaction[];
  topIncome: Transaction | undefined;
  topExpense: Transaction | undefined;
}

// Loads all dashboard data derived from the current filter state/
export function useDashboardData(filters: DashboardFilters): DashboardData {
  const { year, month, transactionType } = filters;

  const [isTransactionEmpty, setIsTransactionEmpty] = useState<boolean | null>(
    null,
  );
  const [fullMonthlyTotal, setFullMonthlyTotal] = useState<MonthlyTotal[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    CategoryPercentage[] | null
  >([]);
  const [thisMonthTransactions, setThisMonthTransactions] = useState<
    Transaction[] | undefined
  >(undefined);
  const [thisMonthTotal, setThisMonthTotal] = useState<MonthlyTotal>({
    month,
    income: 0,
    expense: 0,
  });
  const [lastMonthTotal, setLastMonthTotal] = useState<MonthlyTotal>(() => {
    const lastMonth = month > 1 ? month - 1 : 12;
    return { month: lastMonth, income: 0, expense: 0 };
  });

  useEffect(() => {
    let cancelled = false;

    const checkIsTransactionEmpty = async (): Promise<void> => {
      try {
        const data = await window.api.getTransactions({
          month: null,
          year: null,
          keyword: null,
          transaction_type: null,
          category: null,
        });
        if (cancelled) return;
        setIsTransactionEmpty(data.transactions.length === 0);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    const loadRecentTransactions = async (): Promise<void> => {
      try {
        const data = await window.api.getRecentTransactions(5);
        if (cancelled) return;
        setRecentTransactions(data);
      } catch (error) {
        console.error("Failed to fetch recent transactions:", error);
      }
    };

    void checkIsTransactionEmpty();
    void loadRecentTransactions();
    return () => {
      cancelled = true;
    };
  }, []);

  //  refetch on year change
  useEffect(() => {
    let cancelled = false;
    const loadFullMonthlyTotal = async (): Promise<void> => {
      try {
        const data = await window.api.getFullMonthlyTotal(year);
        if (cancelled) return;
        setFullMonthlyTotal(data ?? []);
      } catch (error) {
        console.error("Failed to load full monthly total:", error);
        if (!cancelled) setFullMonthlyTotal([]);
      }
    };
    void loadFullMonthlyTotal();
    return () => {
      cancelled = true;
    };
  }, [year]);

  // refetch on year or month change
  useEffect(() => {
    let cancelled = false;
    const loadMonthlyTotals = async (): Promise<void> => {
      try {
        const [thisMonth, lastMonthData] = await Promise.all([
          window.api.getMonthlyTotal({ month, year }),
          window.api.getMonthlyTotal({
            month: month === 1 ? 12 : month - 1,
            year: month === 1 ? year - 1 : year,
          }),
        ]);
        if (cancelled) return;
        setThisMonthTotal({
          month,
          income: thisMonth?.income ?? 0,
          expense: thisMonth?.expense ?? 0,
        });
        setLastMonthTotal({
          month: month === 1 ? 12 : month - 1,
          income: lastMonthData?.income ?? 0,
          expense: lastMonthData?.expense ?? 0,
        });
      } catch (error) {
        console.error("Failed to fetch monthly totals:", error);
      }
    };
    void loadMonthlyTotals();
    return () => {
      cancelled = true;
    };
  }, [month, year]);

  // refetch on this-month-transactions
  useEffect(() => {
    let cancelled = false;
    const fetchThisMonthTransactions = async (): Promise<void> => {
      try {
        const data = await window.api.getTransactions({
          month,
          year,
          keyword: null,
          transaction_type: null,
          category: null,
          limit: BIG_NUMBER,
          offset: 0,
        });
        if (cancelled) return;
        setThisMonthTransactions(data.transactions);
      } catch (error) {
        console.error("Failed to fetch this month transactions:", error);
      }
    };
    void fetchThisMonthTransactions();
    return () => {
      cancelled = true;
    };
  }, [month, year]);

  // refetch category-breakdown
  useEffect(() => {
    let cancelled = false;
    const loadCategoryBreakdown = async (): Promise<void> => {
      try {
        const data = await window.api.getCategoryPercentage({
          year,
          month,
          type: transactionType,
        });
        if (cancelled) return;
        setCategoryBreakdown(data);
      } catch (error) {
        console.error("Failed to fetch category breakdown:", error);
      }
    };
    void loadCategoryBreakdown();
    return () => {
      cancelled = true;
    };
  }, [month, year, transactionType]);

  // top income / expense for QuickStats
  const topIncome = useMemo<Transaction | undefined>(() => {
    if (!thisMonthTransactions?.length) return undefined;
    const incomes = thisMonthTransactions.filter(
      (t) => t.transaction_type === "income",
    );
    if (!incomes.length) return undefined;
    const maxIncome = Math.max(...incomes.map((i) => i.amount));
    return thisMonthTransactions.find((t) => t.amount === maxIncome);
  }, [thisMonthTransactions]);

  const topExpense = useMemo<Transaction | undefined>(() => {
    if (!thisMonthTransactions?.length) return undefined;
    const expenses = thisMonthTransactions.filter(
      (t) => t.transaction_type === "expense",
    );
    if (!expenses.length) return undefined;
    const maxExpense = Math.max(...expenses.map((e) => e.amount));
    return thisMonthTransactions.find((t) => t.amount === maxExpense);
  }, [thisMonthTransactions]);

  return {
    isTransactionEmpty,
    fullMonthlyTotal,
    thisMonthTotal,
    lastMonthTotal,
    categoryBreakdown,
    thisMonthTransactions,
    recentTransactions,
    topIncome,
    topExpense,
  };
}
