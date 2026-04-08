import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type {
  Transaction,
  TransactionFilters,
  MonthlyTotalFilters,
  CategoryPerecentageFilters,
} from '@common/types';

const api = {
  platform: process.platform,

  dimTitlebar: (isDimmed: boolean, theme: 'light' | 'dark') =>
    ipcRenderer.send('dim-titlebar', isDimmed, theme),

  setTitlebarTheme: (theme: 'light' | 'dark') => ipcRenderer.send('set-titlebar-theme', theme),

  getTransactions: (filters: TransactionFilters) => ipcRenderer.invoke('getTransactions', filters),
  addTransaction: (transaction: Transaction) => ipcRenderer.invoke('addTransaction', transaction),
  deleteTransaction: (transactionId: string) =>
    ipcRenderer.invoke('deleteTransaction', transactionId),
  updateTransaction: (transaction: Transaction) =>
    ipcRenderer.invoke('updateTransaction', transaction),
  getRecentTransactions: (limit: number) => ipcRenderer.invoke('getRecentTransactions', limit),
  getMonthlyTotal: (filters: MonthlyTotalFilters) => ipcRenderer.invoke('getMonthlyTotal', filters),
  getTransactionById: (id: number) => ipcRenderer.invoke('getTransactionById', id),
  getFullMonthlyTotal: (year: number) => ipcRenderer.invoke('getFullMonthlyTotal', year),
  getAvailableYears: () => ipcRenderer.invoke('getAvailableYears'),
  getCategoryPercentage: (filters: CategoryPerecentageFilters) =>
    ipcRenderer.invoke('getCategoryPercentage', filters),
  resetTable: () => ipcRenderer.invoke('resetTable'),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
