import type AppDatabase from '../services/database';
import type { BrowserWindow } from 'electron';
import { registerTransactionHandlers } from './transactions';
import { registerDashboardHandlers } from './dashboard';
import { registerTitlebarHandlers } from './titlebar';

export function registerAllHandlers(db: AppDatabase, mainWindow: BrowserWindow): void {
  registerTransactionHandlers(db);
  registerDashboardHandlers(db);
  registerTitlebarHandlers(mainWindow);
}
