import { ipcMain } from 'electron'
import AppDatabase from './database'

/**
 * Sets up IPC (Inter-Process Communication) handlers for database operations.
 *
 * These handlers bridge the communication between the main process and the
 * renderer process, allowing the React UI to interact with the SQLite database.
 * Each handler receives calls from the renderer via ipcRenderer.invoke()
 * and forwards them to the appropriate database method.
 *
 * @param db - The AppDatabase instance to use for database operations
 */
export default function setUpHandlers(db: AppDatabase): void {
  /**
   * Handler: getTransactions
   * Retrieves paginated transactions with optional filtering
   */
  ipcMain.handle('getTransactions', async (_, filters) => {
    try {
      return await db.getTransactions(filters)
    } catch (error) {
      console.error('IPC getTransactions error:', error)
      throw error
    }
  })

  /**
   * Handler: addTransaction
   * Inserts a new transaction into the database
   */
  ipcMain.handle('addTransaction', async (_, transaction) => {
    try {
      return await db.addTransaction(transaction)
    } catch (error) {
      console.error('IPC addTransaction error:', error)
      throw error
    }
  })

  /**
   * Handler: deleteTransaction
   * Removes a transaction from the database by ID
   */
  ipcMain.handle('deleteTransaction', async (_, transactionId) => {
    try {
      return await db.deleteTransaction(transactionId)
    } catch (error) {
      console.error('IPC deleteTransaction error:', error)
      throw error
    }
  })

  /**
   * Handler: updateTransaction
   * Updates an existing transaction in the database
   */
  ipcMain.handle('updateTransaction', async (_, transaction) => {
    try {
      return await db.updateTransaction(transaction)
    } catch (error) {
      console.error('IPC updateTransaction error:', error)
      throw error
    }
  })

  /**
   * Handler: getRecentTransactions
   * Retrieves the most recent transactions for dashboard display
   */
  ipcMain.handle('getRecentTransactions', async (_, limit) => {
    try {
      return await db.getRecentTransactions(limit)
    } catch (error) {
      console.error('IPC getRecentTransactions error:', error)
      throw error
    }
  })

  /**
   * Handler: getMonthlyTotal
   * Calculates income and expense totals for a given month/year
   */
  ipcMain.handle('getMonthlyTotal', async (_, filters) => {
    try {
      return await db.getMonthlyTotal(filters)
    } catch (error) {
      console.error('IPC getMonthlyTotal error:', error)
      throw error
    }
  })

  /**
   * Handler: getTransactionById
   * Retrieves a single transaction by its ID
   */
  ipcMain.handle('getTransactionById', async (_, id) => {
    try {
      return await db.getTransactionById(id)
    } catch (error) {
      console.error('IPC getTransactionById error:', error)
      throw error
    }
  })

  /**
   * Handler: getFullMonthlyTotal
   * Calculates income and expense for all 12 months of a year (for trend chart)
   */
  ipcMain.handle('getFullMonthlyTotal', async (_, year) => {
    try {
      return await db.getFullMonthlyTotal(year)
    } catch (error) {
      console.error('IPC getFullMonthlyTotal error:', error)
      throw error
    }
  })

  /**
   * Handler: getAvailableYears
   * Retrieves all years that have transactions (for year filter dropdown)
   */
  ipcMain.handle('getAvailableYears', async () => {
    try {
      return await db.getAvailableYears()
    } catch (error) {
      console.error('IPC getAvailableYears error:', error)
      throw error
    }
  })

  /**
   * Handler: getCategoryPercentage
   * Calculates category breakdown percentages for pie chart display
   */
  ipcMain.handle('getCategoryPercentage', async (_, filters) => {
    try {
      return await db.getCategoryPercentage(filters)
    } catch (error) {
      console.error('Failed to get category percentage: ', error)
      throw error
    }
  })

  /**
   * Handler: resetTable
   * Deletes all transactions from the database (user data reset)
   */
  ipcMain.handle('resetTable', async () => {
    try {
      return await db.resetTable()
    } catch (error) {
      console.error(error)
    }
  })
}
