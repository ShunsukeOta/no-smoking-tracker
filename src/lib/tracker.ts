export const STORAGE_KEY = 'no-smoking-tracker:v1'
export const MINUTE = 60 * 1000
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

export interface QuitProfile {
  age: number
  cigarettesPerDay: number
  packPrice: number
  quitAt: string
}

export interface QuitStats {
  elapsedMs: number
  elapsedDays: number
  fullDays: number
  hours: number
  minutes: number
  seconds: number
  avoidedCigarettes: number
  savedYen: number
  reclaimedMinutes: number
  annualSavings: number
}

export interface Milestone {
  days: number
  label: string
  title: string
  description: string
  isClinical?: boolean
}

/** Milestone information is general guidance, not a personal medical prediction. */
export const MILESTONES: Milestone[] = [
  { days: 1, label: '24時間', title: '最初の24時間', description: 'ニコチンを摂取しない1日を達成。身体が新しいリズムに慣れ始めます。' },
  { days: 3, label: '3日', title: '最初の山場を突破', description: '離脱症状は禁煙後2〜3日頃に強くなることが多く、ここから少しずつ落ち着く人もいます。' },
  { days: 7, label: '1週間', title: '1週間の積み重ね', description: '食後や休憩時間の「吸いたい」を少しずつ新しい行動に置き換えていく時期です。' },
  { days: 14, label: '2週間', title: '身体が慣れてくる頃', description: 'ニコチンの離脱症状は数週間で軽くなる人が多く、変化を感じ始めることがあります。' },
  { days: 30, label: '1か月', title: '禁煙1か月', description: 'タバコを吸わない生活のリズムが育っていきます。睡眠や気分の変化には個人差があります。' },
  { days: 90, label: '3か月', title: '回復を積み重ねる', description: '紙巻きタバコの禁煙研究では、数週間〜数か月で血液循環などの改善が報告されています。', isClinical: true },
  { days: 180, label: '半年', title: '半年の継続', description: '喫煙の習慣から離れる大きな節目です。突然の喫煙欲求には引き続き注意しましょう。' },
  { days: 365, label: '1年', title: '禁煙1周年', description: '紙巻きタバコでは禁煙継続により、長期的な心血管疾患のリスクが下がっていきます。', isClinical: true },
  { days: 730, label: '2年', title: '禁煙2周年', description: '吸わない日々を積み重ね、健康リスクを減らす選択を続けています。' },
  { days: 1825, label: '5年', title: '禁煙5周年', description: '長期禁煙には健康上のメリットがあります。回復の度合いは喫煙歴などで異なります。' },
]

export function isValidProfile(value: unknown): value is QuitProfile {
  if (!value || typeof value !== 'object') return false
  const obj = value as Partial<QuitProfile>
  return Number.isInteger(obj.age) && obj.age! >= 1 && obj.age! <= 120
    && Number.isInteger(obj.cigarettesPerDay) && obj.cigarettesPerDay! >= 1 && obj.cigarettesPerDay! <= 200
    && Number.isFinite(obj.packPrice) && obj.packPrice! > 0 && obj.packPrice! <= 100000
    && typeof obj.quitAt === 'string' && Number.isFinite(Date.parse(obj.quitAt))
    && Date.parse(obj.quitAt) <= Date.now()
}

export function getQuitStats(profile: QuitProfile, now: number = Date.now()): QuitStats {
  const elapsedMs = Math.max(0, now - new Date(profile.quitAt).getTime())
  const elapsedDays = elapsedMs / DAY
  const avoided = elapsedDays * profile.cigarettesPerDay
  return {
    elapsedMs,
    elapsedDays,
    fullDays: Math.floor(elapsedDays),
    hours: Math.floor((elapsedMs % DAY) / HOUR),
    minutes: Math.floor((elapsedMs % HOUR) / MINUTE),
    seconds: Math.floor((elapsedMs % MINUTE) / 1000),
    avoidedCigarettes: Math.floor(avoided),
    savedYen: Math.floor(avoided / 20 * profile.packPrice),
    reclaimedMinutes: Math.floor(avoided * 5),
    annualSavings: Math.round(profile.cigarettesPerDay / 20 * profile.packPrice * 365),
  }
}

export function getNextMilestone(elapsedDays: number) {
  const index = MILESTONES.findIndex((item) => elapsedDays < item.days)
  if (index < 0) return null
  const previous = index === 0 ? 0 : MILESTONES[index - 1].days
  const next = MILESTONES[index]
  const progress = Math.min(100, Math.max(0, (elapsedDays - previous) / (next.days - previous) * 100))
  return { milestone: next, previous, progress, remainingMs: Math.max(0, (next.days - elapsedDays) * DAY) }
}

export function formatRemaining(ms: number): string {
  const totalHours = Math.floor(ms / HOUR)
  const remainingMinutes = Math.ceil((ms % HOUR) / MINUTE)
  if (totalHours >= 48) return `あと${Math.ceil(ms / DAY)}日`
  if (totalHours >= 1) return `あと${totalHours}時間${remainingMinutes > 0 ? `${remainingMinutes}分` : ''}`
  return `あと${Math.max(1, Math.ceil(ms / MINUTE))}分`
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}

/** Convert local datetime to datetime-local form value without UTC offset shifts. */
export function toLocalDatetimeValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function readProfile(): QuitProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    return isValidProfile(value) ? value : null
  } catch { return null }
}

export function saveProfile(profile: QuitProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function clearProfile(): void { localStorage.removeItem(STORAGE_KEY) }
