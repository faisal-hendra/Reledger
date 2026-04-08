/// <reference types="vite/client" />

declare global {
  interface Transaction {
    id?: number;
    transaction_type: 'expense' | 'income';
    name: string;
    amount: number;
    category: string;
    description?: string;
    date: string;
  }

  interface TransactionFilters {
    month: number | null;
    year: number | null;
    keyword: string | null;
    transaction_type: 'income' | 'expense' | null;
    category: string | null;
    limit?: number;
    offset?: number;
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
  }

  interface PaginatedTransactions {
    transactions: Transaction[];
    total: number;
  }

  interface MonthlyTotal {
    month: number;
    income: number;
    expense: number;
  }

  interface MonthlyTotalFilters {
    month: number;
    year: number;
  }

  interface GetYear {
    year: number;
  }

  interface CategoryPercentage {
    category: string;
    category_count: number;
    percentage: number;
  }

  interface CategoryPerecentageFilters {
    year: number;
    month: number;
    type: 'income' | 'expense';
  }

  type Currency = {
    code: string;
    symbol: string;
    name: string;
  };

  interface TimeResponse {
    datetime: string;
    unixtime: number;
    timezone: string;
  }

  interface Window {
    api: {
      platform: NodeJS.Platform;
      dimTitlebar: (isDimmed: boolean, theme: 'light' | 'dark') => void;
      setTitlebarTheme: (theme: 'light' | 'dark') => void;
      getTransactions: (filters: TransactionFilters) => Promise<PaginatedTransactions>;
      addTransaction: (transaction: Transaction) => Promise<void>;
      deleteTransaction: (transactionId: string) => Promise<void>;
      updateTransaction: (transaction: Transaction) => Promise<void>;
      getRecentTransactions: (limit: number) => Promise<Transaction[]>;
      getMonthlyTotal: (filters: MonthlyTotalFilters) => Promise<MonthlyTotal>;
      getTransactionById: (id: number) => Promise<Transaction | null>;
      getFullMonthlyTotal: (
        year: number
      ) => Promise<{ month: number; income: number; expense: number }[] | undefined>;
      getAvailableYears: () => Promise<{ year: number }[]>;
      getCategoryPercentage: (
        filters: CategoryPerecentageFilters
      ) => Promise<CategoryPercentage[] | null>;
      resetTable: () => Promise<void>;
    };
  }
}

export {};
