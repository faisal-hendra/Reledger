import { app, BrowserWindow } from 'electron';
import { createWindow } from './window';
import { setupApp } from './lib/setup';
import AppDatabase from './services/database';
import { registerAllHandlers } from './ipc';

let db: AppDatabase;

setupApp();

app.whenReady().then(() => {
  db = new AppDatabase();
  const mainWindow = createWindow();
  registerAllHandlers(db, mainWindow);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      const newWindow = createWindow();
      registerAllHandlers(db, newWindow);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
