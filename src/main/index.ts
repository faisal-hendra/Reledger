import { app, BrowserWindow } from 'electron';
import { createWindow } from './window';
import { setupApp } from './lib/setup';
import AppDatabase from './services/database';
import { registerAllHandlers } from './ipc';

let db: AppDatabase;

setupApp();

app.whenReady().then(() => {
  db = new AppDatabase();
  registerAllHandlers(db);
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
