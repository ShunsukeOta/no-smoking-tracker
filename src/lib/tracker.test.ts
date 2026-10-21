import { describe, expect, it } from 'vitest'
import { DAY, formatRemaining, getNextMilestone, getQuitStats, isValidProfile, toLocalDatetimeValue } from './tracker'

const quitAt = '2026-10-18T14:00:00.000Z'
const sample = { age: 29, cigarettesPerDay: 10, packPrice: 620, quitAt }

describe('quit statistics', () => {
  it('calculates avoided cigarettes, savings and recovered time', () => {
    const stats = getQuitStats(sample, Date.parse(quitAt) + 2 * DAY)
    expect(stats.avoidedCigarettes).toBe(20)
    expect(stats.savedYen).toBe(620)
    expect(stats.reclaimedMinutes).toBe(100)
    expect(stats.fullDays).toBe(2)
  })
  it('adds savings, cigarette estimates and reclaimed time every second', () => {
    const previous = getQuitStats(sample, Date.parse(quitAt) + DAY)
    const next = getQuitStats(sample, Date.parse(quitAt) + DAY + 1000)
    expect(next.savedYenPrecise).toBeGreaterThan(previous.savedYenPrecise)
    expect(next.avoidedCigarettesPrecise).toBeGreaterThan(previous.avoidedCigarettesPrecise)
    expect(next.reclaimedSecondsPrecise).toBeGreaterThan(previous.reclaimedSecondsPrecise)
    // Savings are not rounded to whole yen for the live display.
    expect(next.savedYenPrecise - previous.savedYenPrecise).toBeCloseTo(310 / 86400, 6)
  })
  it('shows seconds in milestone countdowns, including longer durations', () => {
    expect(formatRemaining(1000)).toBe('0分 01秒')
    expect(formatRemaining(3_661_000)).toBe('1時間 01分 01秒')
    expect(formatRemaining(DAY + 3_661_000)).toBe('1日 01時間 01分 01秒')
    expect(formatRemaining(0)).toBe('0分 00秒')
  })
  it('does not calculate negative progress', () => {
    const stats = getQuitStats(sample, Date.parse(quitAt) - DAY)
    expect(stats.elapsedMs).toBe(0)
    expect(stats.savedYen).toBe(0)
  })
  it('calculates 30-day savings consistently', () => {
    const stats = getQuitStats(sample, Date.parse(quitAt) + 30 * DAY)
    expect(stats.savedYen).toBe(9300)
    expect(stats.avoidedCigarettes).toBe(300)
    expect(stats.reclaimedMinutes).toBe(1500)
  })
  it('selects the next unfinished milestone', () => {
    expect(getNextMilestone(2)?.milestone.days).toBe(3)
    expect(getNextMilestone(3)?.milestone.days).toBe(7)
    expect(getNextMilestone(3)?.progress).toBe(0)
  })
  it('validates stored data and rejects future dates', () => {
    expect(isValidProfile(sample)).toBe(true)
    expect(isValidProfile({ ...sample, age: -1 })).toBe(false)
    expect(isValidProfile({ ...sample, quitAt: '9999-01-01T00:00:00.000Z' })).toBe(false)
  })
  it('formats datetime-local without UTC conversion', () => {
    const date = new Date(2026, 9, 18, 23, 5)
    expect(toLocalDatetimeValue(date)).toBe('2026-10-18T23:05')
  })
})
