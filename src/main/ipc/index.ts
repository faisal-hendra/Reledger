import type AppDatabase from '../services/database';
import { registerTransactionHandlers } from './transactions';
import { registerDashboardHandlers } from './dashboard';
import { registerTitlebarHandlers } from './titlebar';

export function registerAllHandlers(db: AppDatabase): void {
  registerTransactionHandlers(db);
  registerDashboardHandlers(db);
  registerTitlebarHandlers();
}
