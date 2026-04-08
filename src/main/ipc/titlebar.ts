import { ipcMain, BrowserWindow } from 'electron';

export function registerTitlebarHandlers(mainWindow: BrowserWindow): void {
  const applyTitlebarTheme = (theme: 'light' | 'dark', isDimmed = false): void => {
    if (process.platform !== 'win32') return;
    const isLight = theme === 'light';
    mainWindow.setTitleBarOverlay({
      color: isDimmed ? (isLight ? '#7F7F7F' : '#0D0D0D') : isLight ? '#FFFFFF' : '#1B1B1B',
      symbolColor: isDimmed ? (isLight ? '#999999' : '#555555') : isLight ? '#000000' : '#FFFFFF',
    });
  };

  ipcMain.on('dim-titlebar', (_event, isDimmed: boolean, theme: 'light' | 'dark' = 'dark') => {
    const dimTitlebar = (): void => {
      applyTitlebarTheme(theme, isDimmed);
      mainWindow.setClosable(!isDimmed);
      mainWindow.setMinimizable(!isDimmed);
      mainWindow.setMaximizable(!isDimmed);
    };

    setTimeout(() => {
      process.platform === 'win32' && dimTitlebar();
    }, 65);
  });

  ipcMain.on('set-titlebar-theme', (_event, theme: 'light' | 'dark') => {
    applyTitlebarTheme(theme, false);
  });
}
