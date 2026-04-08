import { ipcMain } from 'electron';
import AppDatabase from '../services/database';
import type { Transaction, TransactionFilters } from '@common/types';

export function registerTransactionHandlers(db: AppDatabase): void {
  ipcMain.handle('getTransactions', async (_, filters: TransactionFilters) => {
    try {
      return await db.getTransactions(filters);
    } catch (error) {
      console.error('IPC getTransactions error:', error);
      throw error;
    }
  });

  ipcMain.handle('addTransaction', async (_, transaction: Transaction) => {
    try {
      return await db.addTransaction(transaction);
    } catch (error) {
      console.error('IPC addTransaction error:', error);
      throw error;
    }
  });

  ipcMain.handle('deleteTransaction', async (_, transactionId: number) => {
    try {
      return await db.deleteTransaction(transactionId);
    } catch (error) {
      console.error('IPC deleteTransaction error:', error);
      throw error;
    }
  });

  ipcMain.handle('updateTransaction', async (_, transaction: Transaction) => {
    try {
      return await db.updateTransaction(transaction);
    } catch (error) {
      console.error('IPC updateTransaction error:', error);
      throw error;
    }
  });

  ipcMain.handle('getTransactionById', async (_, id: number) => {
    try {
      return await db.getTransactionById(id);
    } catch (error) {
      console.error('IPC getTransactionById error:', error);
      throw error;
    }
  });

  ipcMain.handle('resetTable', async () => {
    try {
      return await db.resetTable();
    } catch (error) {
      console.error(error);
    }
  });
}
