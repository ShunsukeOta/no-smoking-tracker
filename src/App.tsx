import { useEffect, useState } from 'react'
import { ChartNoAxesColumnIncreasing, ChevronLeft, CigaretteOff, Leaf, RotateCcw, Settings2, WifiOff } from 'lucide-react'
import Dashboard from '@/components/Dashboard'
import ProfileForm from '@/components/ProfileForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { clearProfile, readProfile, saveProfile, type QuitProfile } from '@/lib/tracker'

type Screen = 'dashboard' | 'settings'

function Brand() {
  return <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e7656] text-white"><CigaretteOff size={19} strokeWidth={1.9} /></div><span className="text-[17px] font-bold tracking-[-.055em]">禁煙ログ<span className="ml-1 text-xs font-semibold tracking-normal text-[#88a597]">.</span></span></div>
}

function Settings({ profile, onSave, onBack, onClear }: { profile: QuitProfile, onSave: (profile: QuitProfile) => void, onBack: () => void, onClear: () => void }) {
  const [confirmReset, setConfirmReset] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  return <div className="pb-12 pt-5 sm:pt-7">
    <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-1 text-muted-foreground" onClick={onBack}><ChevronLeft size={16} />記録へ戻る</Button>
    <p className="mb-2 text-xs font-semibold tracking-[.13em] text-[#438d6f]">SETTINGS</p>
    <h1 className="mb-7 text-[28px] font-bold tracking-[-.055em]">設定</h1>
    <ProfileForm initial={profile} error={saveError} onSubmit={(next) => { try { onSave(next); setSaveError(null) } catch { setSaveError('保存できませんでした。ブラウザのストレージ設定をご確認ください。') } }} onCancel={onBack} />
    <Card className="mx-auto mt-8 max-w-[545px] border-[#f0e4e2] shadow-none"><CardContent className="p-6"><div className="flex items-center gap-2 text-sm font-semibold text-foreground"><RotateCcw size={17} />最初からやり直す</div><p className="mt-2 text-xs leading-6 text-muted-foreground">この端末の登録情報と統計を削除し、初回設定画面に戻します。削除後は復元できません。</p>
      {confirmReset ? <div className="mt-4 rounded-xl bg-red-50 p-4"><p className="mb-3 text-sm font-medium text-red-800">本当にすべての記録を削除しますか？</p><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setConfirmReset(false)}>キャンセル</Button><Button variant="destructive" size="sm" onClick={onClear}>削除する</Button></div></div> : <Button variant="outline" size="sm" className="mt-4 text-red-700 hover:bg-red-50" onClick={() => setConfirmReset(true)}>記録をリセット</Button>}
    </CardContent></Card>
    <p className="mt-5 text-center text-xs leading-6 text-muted-foreground">ログイン・サーバー保存・クラウド同期はありません。<br />ブラウザのデータを削除すると記録も消えます。</p>
  </div>
}

export default function App() {
  const [profile, setProfile] = useState<QuitProfile | null>(() => readProfile())
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [now, setNow] = useState(() => Date.now())
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)
  const [storageError, setStorageError] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const timer = window.setInterval(tick, 1000)
    const onVisibility = () => { if (document.visibilityState === 'visible') tick() }
    const onConnection = () => setIsOffline(!navigator.onLine)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('online', onConnection)
    window.addEventListener('offline', onConnection)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('online', onConnection); window.removeEventListener('offline', onConnection) }
  }, [])

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

  return <div className="min-h-dvh bg-[#f7f8f6]">
    <header className="sticky top-0 z-20 border-b border-[#e8ebe7]/85 bg-[#f7f8f6]/95 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-[1040px] items-center justify-between px-5 sm:px-8"><Brand />
      {profile ? <nav aria-label="メインメニュー" className="flex items-center gap-1 rounded-xl bg-[#edf1ed] p-1"><button type="button" onClick={() => { setScreen('dashboard'); window.scrollTo(0, 0) }} className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-colors ${screen === 'dashboard' ? 'bg-white text-[#235a42] shadow-sm' : 'text-[#6d8074] hover:text-foreground'}`}><ChartNoAxesColumnIncreasing size={15} />記録</button><button type="button" onClick={() => { setScreen('settings'); window.scrollTo(0, 0) }} className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-colors ${screen === 'settings' ? 'bg-white text-[#235a42] shadow-sm' : 'text-[#6d8074] hover:text-foreground'}`}><Settings2 size={15} />設定</button></nav> : <span className="text-xs font-semibold tracking-wide text-[#478466]">STAY SMOKE-FREE</span>}
    </div></header>
    {isOffline && <div role="status" className="flex items-center justify-center gap-2 bg-[#eaf1e8] px-4 py-2.5 text-xs font-medium text-[#426d57]"><WifiOff size={14} />オフラインでも記録を確認できます</div>}
    <main className={`mx-auto w-full px-5 sm:px-8 ${!profile ? 'flex min-h-[calc(100dvh-144px)] max-w-[1040px] items-center justify-center py-12 sm:py-16' : 'max-w-[880px] pb-4'}`}>
      {!profile ? <ProfileForm error={storageError} onSubmit={(next) => { try { updateProfile(next) } catch { /* Inline storage warning already set. */ } }} /> : screen === 'settings' ? <Settings profile={profile} onSave={updateProfile} onBack={() => setScreen('dashboard')} onClear={reset} /> : <Dashboard profile={profile} now={now} />}
    </main>
    <footer className="mx-auto max-w-[880px] px-5 pb-7 text-center sm:px-8"><Separator className="mb-5" /><p className="flex items-center justify-center gap-2 text-[11px] text-[#8a9b91]"><Leaf size={12} />禁煙ログ <span className="opacity-60">© 2026</span> すこしずつ、着実に。</p></footer>
  </div>
}
