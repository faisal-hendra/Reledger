import { app } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';

export function setupApp(): void {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
}
