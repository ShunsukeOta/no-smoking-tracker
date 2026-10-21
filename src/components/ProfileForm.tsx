import { useState, type FormEvent } from 'react'
import { ArrowRight, CalendarDays, CigaretteOff, CircleHelp, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { isValidProfile, toLocalDatetimeValue, type QuitProfile } from '@/lib/tracker'

type Props = {
  initial?: QuitProfile
  onSubmit: (profile: QuitProfile) => void
  onCancel?: () => void
  error?: string | null
}

export default function ProfileForm({ initial, onSubmit, onCancel, error }: Props) {
  const [age, setAge] = useState(initial ? String(initial.age) : '')
  const [cigarettes, setCigarettes] = useState(initial ? String(initial.cigarettesPerDay) : '')
  const [price, setPrice] = useState(initial ? String(initial.packPrice) : '')
  const [quitAt, setQuitAt] = useState(toLocalDatetimeValue(initial ? new Date(initial.quitAt) : new Date()))
  const [formError, setFormError] = useState<string | null>(null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = new Date(quitAt)
    if (!Number.isFinite(parsed.getTime())) {
      setFormError('禁煙開始日時を正しく入力してください。')
      return
    }
    const next: QuitProfile = {
      age: Number(age),
      cigarettesPerDay: Number(cigarettes),
      packPrice: Number(price),
      quitAt: parsed.toISOString(),
    }
    if (!isValidProfile(next)) {
      setFormError('入力内容を確認してください。禁煙開始日時は未来に設定できません。')
      return
    }
    setFormError(null)
    onSubmit(next)
  }

  return (
    <div className="mx-auto w-full max-w-[545px] animate-in">
      {!initial && (
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-primary/10 text-primary shadow-soft">
            <CigaretteOff size={26} strokeWidth={1.8} />
          </div>
          <Badge variant="secondary" className="mb-4 border border-primary/10 bg-primary/10 px-3 py-1.5 text-primary border-primary/10">YOUR NEW CHAPTER</Badge>
          <h1 className="text-[27px] font-bold leading-[1.35] tracking-[-.055em] sm:text-[32px]">今日から、<br />吸わない自分に。</h1>
          <p className="mt-4 text-[13px] leading-6 text-muted-foreground">まずは4つだけ教えてください。<br />あなたの禁煙記録を、ここから始めましょう。</p>
        </div>
      )}

      <Card className="overflow-hidden border-border shadow-float">
        <CardContent className="p-5 sm:p-8">
          {initial && <div className="mb-7"><h2 className="text-lg font-bold tracking-tight">記録を編集</h2><p className="mt-2 text-sm text-muted-foreground">変更すると統計が自動で再計算されます。</p></div>}
          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="age">禁煙開始時の年齢 <span className="ml-1 text-primary">*</span></Label>
                <div className="relative">
                  <Input id="age" type="number" inputMode="numeric" min={1} max={120} required placeholder="例：29" value={age} onChange={(e) => setAge(e.target.value)} className="pr-12" />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">歳</span>
                </div>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="cigarettes">1日の喫煙本数 <span className="ml-1 text-primary">*</span></Label>
                <div className="relative">
                  <Input id="cigarettes" type="number" inputMode="numeric" min={1} max={200} step={1} required placeholder="例：10" value={cigarettes} onChange={(e) => setCigarettes(e.target.value)} className="pr-12" />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">本</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2"><Label htmlFor="price">タバコ1箱の価格 <span className="ml-1 text-primary">*</span></Label><span className="text-xs text-muted-foreground">1箱20本で計算</span></div>
              <div className="relative">
                <Input id="price" type="number" inputMode="decimal" min={1} max={100000} step={1} required placeholder="例：620" value={price} onChange={(e) => setPrice(e.target.value)} className="pr-12" />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">円</span>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2"><Label htmlFor="quitAt">最後に吸った日時 <span className="ml-1 text-primary">*</span></Label><CalendarDays size={15} className="text-muted-foreground" /></div>
              <Input id="quitAt" type="datetime-local" required max={toLocalDatetimeValue(new Date())} value={quitAt} onChange={(e) => setQuitAt(e.target.value)} className="text-[13px]" />
              <p className="text-xs leading-5 text-muted-foreground">この日時から禁煙時間をカウントします。</p>
            </div>

            {(formError || error) && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-[13px] text-destructive">{formError || error}</p>}
            <Button type="submit" size="lg" className="mt-2 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              {initial ? '変更を保存する' : '禁煙記録をはじめる'} <ArrowRight size={18} className="ml-1" />
            </Button>
            {onCancel && <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>キャンセル</Button>}
          </form>
        </CardContent>
      </Card>
      <div className="mt-5 flex items-center justify-center gap-2 text-xs leading-6 text-muted-foreground">
        <LockKeyhole size={14} /> データはこの端末だけに保存されます
      </div>
      {!initial && <div className="mx-auto mt-9 grid max-w-md grid-cols-2 gap-3 text-left">
        <div className="flex items-start gap-2.5"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-primary" /><p className="text-xs leading-5 text-muted-foreground">アカウント登録不要<br />外部へのデータ送信なし</p></div>
        <div className="flex items-start gap-2.5"><CircleHelp size={17} className="mt-0.5 shrink-0 text-primary" /><p className="text-xs leading-5 text-muted-foreground">インストール対応<br />オフラインでも使えます</p></div>
      </div>}
    </div>
  )
}
