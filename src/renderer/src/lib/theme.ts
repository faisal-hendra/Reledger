type Theme = 'dark' | 'light' | 'system'

export function resolveTheme(theme: Theme): 'dark' | 'light' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

export function applyDim(isOpen: boolean, theme: Theme): void {
  window.api.dimTitlebar(isOpen, resolveTheme(theme))
}
