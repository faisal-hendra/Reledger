export interface Transaction {
  id?: number;
  transaction_type: 'expense' | 'income';
  name: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export interface TransactionFilters {
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

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
}

export interface MonthlyTotal {
  month: number;
  income: number;
  expense: number;
}

export interface MonthlyTotalFilters {
  month: number;
  year: number;
}

export interface GetYear {
  year: number;
}

export interface CategoryPercentage {
  category: string;
  category_count: number;
  percentage: number;
}

export interface CategoryPerecentageFilters {
  year: number;
  month: number;
  type: 'income' | 'expense';
}

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export interface TimeResponse {
  datetime: string;
  unixtime: number;
  timezone: string;
}
