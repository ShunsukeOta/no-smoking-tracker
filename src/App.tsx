import { useEffect, useState } from 'react'
import { ChartNoAxesColumnIncreasing, ChevronLeft, CigaretteOff, Leaf, Moon, RotateCcw, Settings2, Sun, WifiOff } from 'lucide-react'
import Dashboard from '@/components/Dashboard'
import ProfileForm from '@/components/ProfileForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { clearProfile, readProfile, saveProfile, type QuitProfile } from '@/lib/tracker'
import { readThemePreference, resolveTheme, saveThemePreference, type ThemePreference } from '@/lib/theme'

type Screen = 'dashboard' | 'settings'

function Brand() {
  return <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-primary text-primary-foreground"><CigaretteOff size={17} strokeWidth={1.9} /></div><span className="text-[15px] font-bold tracking-[-.05em]">禁煙ログ<span className="ml-1 text-xs text-primary">.</span></span></div>
}

function Settings({ profile, onSave, onBack, onClear }: { profile: QuitProfile; onSave: (profile: QuitProfile) => void; onBack: () => void; onClear: () => void }) {
  const [confirmReset, setConfirmReset] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  return <div className="pb-10 pt-5 sm:pt-7">
    <Button variant="ghost" size="sm" className="mb-5 -ml-2 gap-1 text-muted-foreground" onClick={onBack}><ChevronLeft size={16} />記録へ戻る</Button>
    <p className="mb-1.5 text-[10px] font-semibold tracking-[.13em] text-primary">SETTINGS</p>
    <h1 className="mb-6 text-[24px] font-bold tracking-[-.055em]">設定</h1>
    <ProfileForm initial={profile} error={saveError} onSubmit={(next) => { try { onSave(next); setSaveError(null) } catch { setSaveError('保存できませんでした。ブラウザのストレージ設定をご確認ください。') } }} onCancel={onBack} />
    <Card className="mx-auto mt-6 max-w-[545px] shadow-none"><CardContent className="p-5"><div className="flex items-center gap-2 text-[13px] font-semibold"><RotateCcw size={16} />最初からやり直す</div><p className="mt-2 text-xs leading-5 text-muted-foreground">この端末の登録情報と統計を削除し、初回設定画面に戻します。削除後は復元できません。</p>
      {confirmReset ? <div className="mt-4 rounded-xl bg-destructive/10 p-4"><p className="mb-3 text-[13px] font-medium text-destructive">本当にすべての記録を削除しますか？</p><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setConfirmReset(false)}>キャンセル</Button><Button variant="destructive" size="sm" onClick={onClear}>削除する</Button></div></div> : <Button variant="outline" size="sm" className="mt-4 text-destructive hover:bg-destructive/10" onClick={() => setConfirmReset(true)}>記録をリセット</Button>}
    </CardContent></Card>
    <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground">ログイン・サーバー保存・クラウド同期はありません。<br />ブラウザのデータを削除すると記録も消えます。</p>
  </div>
}

export default function App() {
  const [profile, setProfile] = useState<QuitProfile | null>(() => readProfile())
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [now, setNow] = useState(() => Date.now())
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [theme, setTheme] = useState<ThemePreference>(() => readThemePreference())
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const isDark = resolveTheme(theme, systemDark) === 'dark'

  useEffect(() => {
    let timeout: number
    const tick = () => {
      setNow(Date.now())
      // Sync against the actual wall clock, rather than incrementing a counter.
      timeout = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 12)
    }
    tick()
    const onVisibility = () => { if (document.visibilityState === 'visible') { clearTimeout(timeout); tick() } }
    const onConnection = () => setIsOffline(!navigator.onLine)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('online', onConnection)
    window.addEventListener('offline', onConnection)
    return () => { clearTimeout(timeout); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('online', onConnection); window.removeEventListener('offline', onConnection) }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#101815' : '#f7f8f6')
  }, [isDark])

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark'
    setTheme(next)
    saveThemePreference(next)
  }

  function updateProfile(next: QuitProfile) {
    try {
      saveProfile(next)
      setProfile(next)
      setNow(Date.now())
      setStorageError(null)
      setScreen('dashboard')
      window.scrollTo(0, 0)
    } catch {
      setStorageError('端末に保存できませんでした。プライベートブラウズやストレージ設定をご確認ください。')
      throw new Error('Storage not available')
    }
  }

  function reset() {
    try {
      clearProfile()
      setProfile(null)
      setScreen('dashboard')
      setStorageError(null)
      window.scrollTo(0, 0)
    } catch { setStorageError('記録を削除できませんでした。ブラウザのストレージ設定をご確認ください。') }
  }

  return <div className="min-h-dvh bg-background text-foreground transition-colors duration-200">
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur-xl"><div className="mx-auto flex h-[64px] max-w-[1040px] items-center justify-between gap-3 px-4 sm:px-8"><Brand />
      <div className="flex items-center gap-2">
        {profile ? <nav aria-label="メインメニュー" className="flex items-center gap-0.5 rounded-xl bg-muted p-1"><button type="button" aria-current={screen === 'dashboard' ? 'page' : undefined} onClick={() => { setScreen('dashboard'); window.scrollTo(0, 0) }} className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold transition-colors ${screen === 'dashboard' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><ChartNoAxesColumnIncreasing size={14} />記録</button><button type="button" aria-current={screen === 'settings' ? 'page' : undefined} onClick={() => { setScreen('settings'); window.scrollTo(0, 0) }} className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold transition-colors ${screen === 'settings' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><Settings2 size={14} />設定</button></nav> : <span className="hidden text-[10px] font-semibold tracking-wide text-primary sm:inline">STAY SMOKE-FREE</span>}
        <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-xl bg-card" onClick={toggleTheme} aria-label={isDark ? 'ライトモードに切り替える' : 'ダークモードに切り替える'} title={isDark ? 'ライトモード' : 'ダークモード'}>{isDark ? <Sun size={16} /> : <Moon size={16} />}</Button>
      </div>
    </div></header>
    {isOffline && <div role="status" className="flex items-center justify-center gap-2 border-b border-border bg-muted px-4 py-2 text-xs font-medium text-muted-foreground"><WifiOff size={14} />オフラインでも記録を確認できます</div>}
    <main className={`mx-auto w-full px-4 sm:px-8 ${!profile ? 'flex min-h-[calc(100dvh-144px)] max-w-[1040px] items-center justify-center py-10 sm:py-14' : 'max-w-[880px] pb-4'}`}>
      {!profile ? <ProfileForm error={storageError} onSubmit={(next) => { try { updateProfile(next) } catch { /* Inline storage warning already set. */ } }} /> : screen === 'settings' ? <Settings profile={profile} onSave={updateProfile} onBack={() => setScreen('dashboard')} onClear={reset} /> : <Dashboard profile={profile} now={now} />}
    </main>
    <footer className="mx-auto max-w-[880px] px-4 pb-7 text-center sm:px-8"><Separator className="mb-4" /><p className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground"><Leaf size={12} />禁煙ログ <span className="opacity-60">© 2026</span> すこしずつ、着実に。</p></footer>
  </div>
}
