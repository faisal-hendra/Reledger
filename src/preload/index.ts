import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

/**
 * Preload script - Exposes safe APIs from main process to renderer
 *
 * This script runs in a sandboxed environment with access to both Node.js
 * and the renderer process. It exposes a limited API surface via contextBridge
 * to prevent arbitrary code execution in the renderer.
 *
 * Security: Context isolation must be enabled for this to work securely.
 * The 'api' object provides controlled access to Electron IPC channels.
 */

// Custom APIs for renderer
const api = {
  // Get operating system name ('win32' | 'darwin' | 'linux')
  platform: process.platform,

  /**
   * Controls window titlebar appearance on Windows.
   * Used to dim/disable controls during modal dialogs.
   *
   * @param isDimmed - Whether to dim the titlebar
   * @param theme - Current theme ('light' or 'dark')
   */
  dimTitlebar: (isDimmed: boolean, theme: 'light' | 'dark') =>
    ipcRenderer.send('dim-titlebar', isDimmed, theme),

  // Set titlebar theme on windows (non-dimmed state)
  setTitlebarTheme: (theme: 'light' | 'dark') => ipcRenderer.send('set-titlebar-theme', theme),

  // Database operations - CRUD
  /** Retrieves paginated transactions with optional filtering */
  getTransactions: (filters: TransactionFilters) => ipcRenderer.invoke('getTransactions', filters),
  /** Inserts a new transaction into the database */
  addTransaction: (transaction: Transaction) => ipcRenderer.invoke('addTransaction', transaction),
  /** Removes a transaction by ID */
  deleteTransaction: (transactionId: string) =>
    ipcRenderer.invoke('deleteTransaction', transactionId),
  /** Updates an existing transaction */
  updateTransaction: (transaction: Transaction) =>
    ipcRenderer.invoke('updateTransaction', transaction),
  /** Retrieves recent transactions for dashboard display */
  getRecentTransactions: (limit: number) => ipcRenderer.invoke('getRecentTransactions', limit),
  /** Calculates monthly income/expense totals */
  getMonthlyTotal: (filters: MonthlyTotalFilters) => ipcRenderer.invoke('getMonthlyTotal', filters),
  /** Retrieves a single transaction by ID */
  getTransactionById: (id: number) => ipcRenderer.invoke('getTransactionById', id),
  /** Calculates yearly totals for all 12 months (trend chart) */
  getFullMonthlyTotal: (year: number) => ipcRenderer.invoke('getFullMonthlyTotal', year),
  /** Retrieves available years for filter dropdown */
  getAvailableYears: () => ipcRenderer.invoke('getAvailableYears'),
  /** Calculates category breakdown percentages for pie chart */
  getCategoryPercentage: (filters: CategoryPerecentageFilters) =>
    ipcRenderer.invoke('getCategoryPercentage', filters),
  /** Deletes all transactions (data reset) */
  resetTable: () => ipcRenderer.invoke('resetTable')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
