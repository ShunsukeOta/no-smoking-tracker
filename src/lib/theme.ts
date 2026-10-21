export const THEME_STORAGE_KEY = 'no-smoking-tracker:theme'
export type ThemePreference = 'system' | 'light' | 'dark'

export function readThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch { /* Storage can be unavailable in private mode. */ }
  return 'system'
}

export function saveThemePreference(mode: ThemePreference): void {
  try {
    if (mode === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch { /* Theme selection still works in this tab. */ }
}

export function resolveTheme(mode: ThemePreference, prefersDark: boolean): 'light' | 'dark' {
  return mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode
}
