import { describe, expect, it } from 'vitest'
import { resolveTheme } from './theme'

describe('color theme', () => {
  it('follows system preference until an explicit choice is made', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })
  it('honors explicit light/dark overrides', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
  })
})
