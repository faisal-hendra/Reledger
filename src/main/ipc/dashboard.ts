import { ipcMain } from 'electron';
import AppDatabase from '../services/database';
import type { MonthlyTotalFilters, CategoryPerecentageFilters } from '@common/types';

export function registerDashboardHandlers(db: AppDatabase): void {
  ipcMain.handle('getRecentTransactions', async (_, limit: number) => {
    try {
      return await db.getRecentTransactions(limit);
    } catch (error) {
      console.error('IPC getRecentTransactions error:', error);
      throw error;
    }
  });

  ipcMain.handle('getMonthlyTotal', async (_, filters: MonthlyTotalFilters) => {
    try {
      return await db.getMonthlyTotal(filters);
    } catch (error) {
      console.error('IPC getMonthlyTotal error:', error);
      throw error;
    }
  });

  ipcMain.handle('getFullMonthlyTotal', async (_, year: number) => {
    try {
      return await db.getFullMonthlyTotal(year);
    } catch (error) {
      console.error('IPC getFullMonthlyTotal error:', error);
      throw error;
    }
  });

  ipcMain.handle('getAvailableYears', async () => {
    try {
      return await db.getAvailableYears();
    } catch (error) {
      console.error('IPC getAvailableYears error:', error);
      throw error;
    }
  });

  ipcMain.handle('getCategoryPercentage', async (_, filters: CategoryPerecentageFilters) => {
    try {
      return await db.getCategoryPercentage(filters);
    } catch (error) {
      console.error('Failed to get category percentage: ', error);
      throw error;
    }
  });
}
