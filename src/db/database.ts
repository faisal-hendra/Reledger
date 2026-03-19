import { app } from 'electron'
import path from 'node:path'
import Database from 'better-sqlite3'

/**
 * AppDatabase - SQLite database manager for Reledger
 *
 * Handles all local data persistence using SQLite via better-sqlite3.
 * Database file is stored in the user's app data directory.
 * Uses WAL (Write-Ahead Logging) mode for better concurrency and performance.
 */
class AppDatabase {
  db: Database.Database

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'reledger.sqlite')
    this.db = new Database(dbPath)
    this.db.pragma('journal_mode = WAL')
    this.setUpDatabase()
  }

  /**
   * Initializes the database schema by creating required tables if they don't exist.
   * Creates the 'transactions' table with all necessary columns for storing financial data.
   *
   * @throws {Error} If database initialization fails
   */
  setUpDatabase(): void {
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          transaction_type TEXT NOT NULL CHECK(transaction_type IN ('expense', 'income')),
          name TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `)
      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Database setup failed:', error)
      throw error
    }
  }

  /**
   * Inserts a new transaction into the database.
   *
   * @param transaction - The transaction object containing type, name, amount, category, description, and date
   * @throws {Error} If the insert operation fails
   */
  addTransaction(transaction: Transaction): void {
    try {
      const stmt = this.db.prepare(`
      INSERT INTO transactions (transaction_type, name, amount, category, description, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
      stmt.run(
        transaction.transaction_type,
        transaction.name,
        transaction.amount,
        transaction.category,
        transaction.description,
        transaction.date
      )
    } catch (error) {
      console.error('Failed to add transaction:', error)
      throw error
    }
  }

  /**
   * Updates an existing transaction in the database.
   *
   * @param transaction - The transaction object with updated values, must include id
   * @throws {Error} If the update operation fails
   */
  updateTransaction(transaction: Transaction): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE transactions SET transaction_type = ?, name = ?, amount = ?, category = ?, description = ?, date = ? WHERE id = ?
      `)
      stmt.run(
        transaction.transaction_type,
        transaction.name,
        transaction.amount,
        transaction.category,
        transaction.description,
        transaction.date,
        transaction.id
      )
    } catch (error) {
      console.error('Failed to update transaction:', error)
      throw error
    }
  }

  /**
   * Deletes a transaction from the database by its ID.
   *
   * @param transactionId - The unique identifier of the transaction to delete
   * @throws {Error} If the delete operation fails
   */
  deleteTransaction(transactionId: number): void {
    try {
      const stmt = this.db.prepare(`
        DELETE FROM transactions WHERE id = ?
      `)
      stmt.run(transactionId)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      throw error
    }
  }

  /**
   * Retrieves paginated transactions with optional filtering.
   * Supports filtering by month, year, keyword (name/description), and category.
   * Returns both the filtered transactions and total count for pagination.
   *
   * @param filters - Filter options including month, year, keyword, category, and pagination params
   * @returns Object containing array of transactions and total count
   * @throws {Error} If the query fails
   */
  getTransactions(filters: TransactionFilters): { transactions: Transaction[]; total: number } {
    try {
      let query = 'SELECT * FROM transactions WHERE 1=1'
      let countQuery = 'SELECT COUNT(*) as count FROM transactions WHERE 1=1'
      const params: (string | number)[] = []
      const countParams: (string | number)[] = []

      if (filters.month) {
        const monthCondition = " AND strftime('%m', date) = ?"
        query += monthCondition
        countQuery += monthCondition
        const monthVal = filters.month.toString().padStart(2, '0')
        params.push(monthVal)
        countParams.push(monthVal)
      }
      if (filters.year) {
        const yearCondition = " AND strftime('%Y', date) = ?"
        query += yearCondition
        countQuery += yearCondition
        const yearVal = filters.year.toString()
        params.push(yearVal)
        countParams.push(yearVal)
      }
      if (filters.keyword) {
        const keywordCondition = ' AND (name LIKE ? OR description LIKE ?)'
        query += keywordCondition
        countQuery += keywordCondition
        const keywordVal = `%${filters.keyword}%`
        params.push(keywordVal, keywordVal)
        countParams.push(keywordVal, keywordVal)
      }
      if (filters.category) {
        const categoryCondition = ' AND category = ?'
        query += categoryCondition
        countQuery += categoryCondition
        params.push(filters.category)
        countParams.push(filters.category)
      }

      const sortColumn = filters.sortColumn || 'date'
      const sortDirection = filters.sortDirection === 'asc' ? 'ASC' : 'DESC'
      if (sortColumn === 'date') {
        query += ` ORDER BY date(${sortColumn}) ${sortDirection}`
      } else {
        query += ` ORDER BY ${sortColumn} ${sortDirection}`
      }

      if (filters.limit !== undefined) {
        query += ` LIMIT ${filters.limit}`
        if (filters.offset !== undefined) {
          query += ` OFFSET ${filters.offset}`
        }
      }

      const stmt = this.db.prepare(query)
      const transactions = stmt.all(...params) as Transaction[]

      const countStmt = this.db.prepare(countQuery)
      const countResult = countStmt.get(...countParams) as { count: number }

      return {
        transactions,
        total: countResult.count
      }
    } catch (error) {
      console.error('Failed to get all transactions:', error)

      throw error
    }
  }

  /**
   * Retrieves a single transaction by its ID.
   *
   * @param transactionId - The unique identifier of the transaction
   * @returns The transaction object or null if not found
   * @throws {Error} If the query fails
   */
  getTransactionById(transactionId: number): Transaction | null {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM transactions WHERE id = ?
      `)
      return stmt.get(transactionId) as Transaction | null
    } catch (error) {
      console.error('Failed to get transaction by id:', error)
      throw error
    }
  }

  /**
   * Retrieves the most recent transactions ordered by date descending.
   * Used for displaying recent activity on the dashboard.
   *
   * @param limit - Maximum number of transactions to return
   * @returns Array of recent transactions or null if none exist
   * @throws {Error} If the query fails
   */
  getRecentTransactions(limit: number): Transaction[] | null {
    try {
      const query = `SELECT * FROM transactions ORDER BY date(date) DESC LIMIT ?`
      const stmt = this.db.prepare(query)
      return stmt.all(limit) as Transaction[]
    } catch (error) {
      console.error('Failed to get recent transaction: ', error)
      throw error
    }
  }

  /**
   * Calculates total income and expenses for a given month/year.
   * Used for dashboard summary cards showing financial totals.
   *
   * @param filters - Object containing month and year to aggregate
   * @returns Object with income and expense totals (may be null if no data)
   * @throws {Error} If the query fails
   */
  getMonthlyTotal(filters: MonthlyTotalFilters): MonthlyTotal | null {
    try {
      let query = `
      SELECT
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
    `
      const params: (string | number)[] = []
      const conditions: string[] = []

      if (filters.month) {
        conditions.push("strftime('%m', date) = ?")
        params.push(filters.month.toString().padStart(2, '0'))
      }
      if (filters.year) {
        conditions.push("strftime('%Y', date) = ?")
        params.push(filters.year.toString())
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ')
      }

      const stmt = this.db.prepare(query)
      return stmt.get(...params) as MonthlyTotal
    } catch (error) {
      console.error('Failed to fetch monthly total', error)
      throw error
    }
  }

  /**
   * Calculates income and expenses for all 12 months of a given year.
   * Uses a LEFT JOIN with a months table to ensure all months are represented,
   * even those with no transactions (returns 0 for those months).
   * Used for the yearly trend chart on the dashboard.
   *
   * @param year - The year to aggregate data for
   * @returns Array of 12 objects with month, income, and expense values
   * @throws {Error} If the query fails
   */
  getFullMonthlyTotal(
    year: number
  ): { month: number; income: number; expense: number }[] | undefined {
    try {
      const query = `
      SELECT
        month.month as month,
        COALESCE(total.income, 0) as income,
        COALESCE(total.expense, 0) as expense
      FROM (
        SELECT 1 as month UNION ALL
        SELECT 2 as month UNION ALL
        SELECT 3 as month UNION ALL
        SELECT 4 as month UNION ALL
        SELECT 5 as month UNION ALL
        SELECT 6 as month UNION ALL
        SELECT 7 as month UNION ALL
        SELECT 8 as month UNION ALL
        SELECT 9 as month UNION ALL
        SELECT 10 as month UNION ALL
        SELECT 11 as month UNION ALL
        SELECT 12 as month
      ) as month
      LEFT JOIN (
        SELECT
          CAST(strftime('%m', date) AS INTEGER) as month,
          SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as expense
        FROM transactions
        WHERE strftime('%Y', date) = ?
        GROUP BY month
      ) as total ON month.month = total.month
    `
      const stmt = this.db.prepare(query)
      return stmt.all(year.toString()) as { month: number; income: number; expense: number }[]
    } catch (error) {
      console.error('Failed to fetch full monthly total', error)
      throw error
    }
  }

  /**
   * Retrieves all years that have transactions in the database.
   * Used to populate the year filter dropdown with only relevant options.
   *
   * @returns Array of year objects sorted in descending order
   * @throws {Error} If the query fails
   */
  getAvailableYears(): GetYear[] {
    try {
      const stmt = this.db.prepare(`
      SELECT DISTINCT CAST(strftime('%Y', date) AS INTEGER) AS year
      FROM transactions
      ORDER BY year DESC
    `)
      return stmt.all() as GetYear[]
    } catch (error) {
      console.error('Failed to fetch years: ', error)
      throw error
    }
  }

  /**
   * Calculates the percentage breakdown of expenses/income by category.
   * Used for the category pie chart on the dashboard.
   * Each category's amount is expressed as a percentage of total for that month.
   *
   * @param filters - Object containing year, month, and transaction type
   * @returns Array of category objects with name, total amount, and percentage
   * @throws {Error} If the query fails
   */
  getCategoryPercentage(filters: CategoryPerecentageFilters): CategoryPercentage[] | null {
    try {
      const stmt = this.db.prepare(`
        SELECT
          category,
          SUM(amount) AS category_total,
          SUM(amount) * 100.0 / (
            SELECT SUM(amount)
            FROM transactions
            WHERE
              strftime('%Y', date) = ?
              AND strftime('%m', date) = ?
              AND transaction_type = ?
          ) AS percentage
        FROM
          transactions
        WHERE
          strftime('%Y', date) = ?
          AND strftime('%m', date) = ?
          AND transaction_type = ?
        GROUP BY
          category
        ORDER BY
          percentage DESC;
          `)
      return stmt.all(
        filters.year.toString(),
        filters.month.toString().padStart(2, '0'),
        filters.type,
        filters.year.toString(),
        filters.month.toString().padStart(2, '0'),
        filters.type
      ) as CategoryPercentage[]
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * Deletes all transactions from the database.
   * Used in Settings to reset all user data.
   * Note: This is a destructive operation and cannot be undone.
   */
  resetTable(): void {
    try {
      this.db.exec(`DELETE FROM transactions`)
    } catch (error) {
      console.error('Failed to reset table: ', error)
    }
  }

  /**
   * Closes the database connection.
   * Should be called when the application is shutting down.
   */
  close(): void {
    try {
      this.db.close()
    } catch (error) {
      console.error('Failed to close the database: ', error)
    }
  }
}

export default AppDatabase
