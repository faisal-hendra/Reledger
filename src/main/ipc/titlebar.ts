import { ipcMain, BrowserWindow } from 'electron';

export function registerTitlebarHandlers(): void {
  const applyTitlebarTheme = (
    win: BrowserWindow,
    theme: 'light' | 'dark',
    isDimmed = false
  ): void => {
    if (process.platform !== 'win32') return;
    const isLight = theme === 'light';
    win.setTitleBarOverlay({
      color: isDimmed ? (isLight ? '#7F7F7F' : '#0D0D0D') : isLight ? '#FFFFFF' : '#1B1B1B',
      symbolColor: isDimmed ? (isLight ? '#999999' : '#555555') : isLight ? '#000000' : '#FFFFFF',
    });
  };

  ipcMain.on('dim-titlebar', (event, isDimmed: boolean, theme: 'light' | 'dark' = 'dark') => {
    const dimTitlebar = (): void => {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (!win) return;
      applyTitlebarTheme(win, theme, isDimmed);
      win.setClosable(!isDimmed);
      win.setMinimizable(!isDimmed);
      win.setMaximizable(!isDimmed);
    };

    setTimeout(() => {
      process.platform === 'win32' && dimTitlebar();
    }, 65);
  });

  ipcMain.on('set-titlebar-theme', (event, theme: 'light' | 'dark') => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    applyTitlebarTheme(win, theme, false);
  });
}
