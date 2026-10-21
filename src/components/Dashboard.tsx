import { useState } from 'react'
import { ArrowDownRight, ArrowRight, BadgeCheck, CalendarCheck2, Check, CheckCircle2, ChevronDown, ChevronUp, CigaretteOff, Clock3, Coins, Heart, Info, Leaf, TrendingUp, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { formatDateTime, formatRemaining, getNextMilestone, getQuitStats, MILESTONES, type QuitProfile } from '@/lib/tracker'

const number = new Intl.NumberFormat('ja-JP').format
const yenFormat = new Intl.NumberFormat('ja-JP', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
const cigarettesFormat = new Intl.NumberFormat('ja-JP', { minimumFractionDigits: 5, maximumFractionDigits: 5 })
const secondsFormat = new Intl.NumberFormat('ja-JP', { minimumIntegerDigits: 2, minimumFractionDigits: 2, maximumFractionDigits: 2 })
const pad = (n: number) => String(n).padStart(2, '0')

function elapsedParts(elapsedMs: number) {
  const totalSeconds = Math.floor(elapsedMs / 1000)
  const totalHours = Math.floor(totalSeconds / 3600)
  return {
    totalHours,
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function ReclaimedTime({ seconds }: { seconds: number }) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5 tabular-nums">
    {hours > 0 && <><strong className="text-[23px] font-semibold tracking-tight sm:text-[25px]">{number(hours)}</strong><span className="text-xs text-muted-foreground">時間</span></>}
    {(minutes > 0 || hours > 0) && <><strong className="text-[23px] font-semibold tracking-tight sm:text-[25px]">{minutes}</strong><span className="text-xs text-muted-foreground">分</span></>}
    <strong className="text-[23px] font-semibold tracking-tight sm:text-[25px]">{secondsFormat.format(remainingSeconds)}</strong><span className="text-xs text-muted-foreground">秒</span>
  </div>
}

export default function Dashboard({ profile, now }: { profile: QuitProfile; now: number }) {
  const [showAll, setShowAll] = useState(false)
  const stats = getQuitStats(profile, now)
  const elapsed = elapsedParts(stats.elapsedMs)
  const next = getNextMilestone(stats.elapsedDays)
  const visibleMilestones = showAll ? MILESTONES : MILESTONES.slice(0, 6)

  return (
    <div className="space-y-4 pb-10 sm:space-y-5">
      <section className="mb-5 flex items-end justify-between gap-3 pt-5 sm:pt-6">
        <div>
          <h1 className="text-[21px] font-bold tracking-[-.05em] sm:text-[24px]">禁煙記録</h1>
        </div>
        <Badge variant="secondary" className="mb-1 shrink-0 border border-primary/10 bg-primary/10 py-1.5 text-primary"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" />継続中</Badge>
      </section>

      <section aria-label="禁煙継続時間" className="relative isolate overflow-hidden rounded-[22px] bg-[#153e32] p-5 text-white shadow-float dark:border dark:border-emerald-400/10 dark:bg-[#18372d] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#7cce9a]/10 blur-[4px]" />
        <div className="pointer-events-none absolute -bottom-48 right-10 h-72 w-72 rounded-full border-[50px] border-white/[.04]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 text-xs text-[#badcc9]"><span className="flex items-center gap-2"><Clock3 size={15} />禁煙を続けている時間</span><CigaretteOff size={19} className="text-[#c1e6a8]" /></div>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5 gap-y-2 tabular-nums" role="timer" aria-label={`禁煙継続 ${elapsed.days}日${elapsed.hours}時間${elapsed.minutes}分${elapsed.seconds}秒`}>
            {elapsed.totalHours < 72 ? <>
              <span className="text-[clamp(2.5rem,9.5vw,4.2rem)] font-semibold leading-none tracking-[-.07em]">{number(elapsed.totalHours)}</span><span className="mr-1 text-base font-medium text-[#d3efdb]">時間</span>
              <span className="text-[clamp(2.5rem,9.5vw,4.2rem)] font-semibold leading-none tracking-[-.07em]">{pad(elapsed.minutes)}</span><span className="mr-1 text-base font-medium text-[#d3efdb]">分</span>
            </> : <>
              <span className="text-[clamp(2.3rem,8vw,3.8rem)] font-semibold leading-none tracking-[-.07em]">{number(elapsed.days)}</span><span className="mr-1 text-base font-medium text-[#d3efdb]">日</span>
              <span className="text-[clamp(2.3rem,8vw,3.8rem)] font-semibold leading-none tracking-[-.07em]">{pad(elapsed.hours)}</span><span className="mr-1 text-base font-medium text-[#d3efdb]">時間</span>
              <span className="text-[clamp(2rem,6vw,3rem)] font-semibold leading-none tracking-[-.06em]">{pad(elapsed.minutes)}</span><span className="mr-1 text-sm text-[#d3efdb]">分</span>
            </>}
            <span className="text-[clamp(2rem,6vw,3rem)] font-semibold leading-none tracking-[-.06em] text-[#c5efa7]">{pad(elapsed.seconds)}</span><span className="text-sm text-[#d3efdb]">秒</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#b8d8c6]"><span className="h-1.5 w-1.5 rounded-full bg-[#9fe4ab] motion-safe:animate-pulse" />リアルタイム更新中</div>
          <div className="mt-6 border-t border-white/15 pt-4 sm:mt-7">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className="text-[11px] font-medium text-[#bddcca]">次のマイルストーン</span><span className="text-[11px] font-semibold tabular-nums text-[#c5efa7]">{next ? next.milestone.label : 'すべて達成！'}</span></div>
            <Progress value={next?.progress ?? 100} className="h-2 bg-white/15 [&>div]:bg-[#b8ef97]" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-medium text-[#ecfff3]">{next?.milestone.title ?? 'すべて達成'}</p><span className="text-[11px] tabular-nums text-[#a6c7b5]">{Math.floor(next?.progress ?? 100)}%</span></div>
            {next && <div className="mt-2 flex flex-wrap items-baseline gap-1.5 text-[#c5efa7]"><span className="text-[11px] text-[#b9d7c4]">達成まで</span><span className="font-mono text-[16px] font-semibold tracking-[-.025em] tabular-nums sm:text-[18px]">{formatRemaining(next.remainingMs)}</span></div>}
          </div>
        </div>
      </section>

      <section aria-label="禁煙の成果" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card className="col-span-2 rounded-[18px] sm:col-span-1"><CardContent className="p-4 sm:p-5">
          <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"><Wallet size={18} /></div>
          <p className="text-[11px] text-muted-foreground">節約できたお金</p>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-1 tabular-nums"><strong className="text-[27px] font-semibold tracking-[-.065em] sm:text-[25px]">{yenFormat.format(stats.savedYenPrecise)}</strong><span className="text-xs text-muted-foreground">円</span></div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-primary"><TrendingUp size={13} /> 0.001円単位で更新</div>
        </CardContent></Card>
        <Card className="rounded-[18px]"><CardContent className="p-4 sm:p-5">
          <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300"><CigaretteOff size={18} /></div>
          <p className="text-[11px] text-muted-foreground">吸わなかった本数（推計）</p>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-1 tabular-nums"><strong className="text-[23px] font-semibold tracking-[-.06em] sm:text-[22px]">{cigarettesFormat.format(stats.avoidedCigarettesPrecise)}</strong><span className="text-xs text-muted-foreground">本</span></div>
          <p className="mt-2 text-[10px] text-muted-foreground">以前の1日{profile.cigarettesPerDay}本から試算</p>
        </CardContent></Card>
        <Card className="rounded-[18px]"><CardContent className="p-4 sm:p-5">
          <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-300"><Clock3 size={18} /></div>
          <p className="text-[11px] text-muted-foreground">取り戻した時間（推計）</p>
          <div className="mt-1.5"><ReclaimedTime seconds={stats.reclaimedSecondsPrecise} /></div>
          <p className="mt-2 text-[10px] text-muted-foreground">1本あたり5分で換算</p>
        </CardContent></Card>
      </section>
      <p className="-mt-1 text-[10px] leading-4 text-muted-foreground">※ 節約額・本数・時間は過去の喫煙ペースに基づく連続的な推計値です。実際に部分的な1本を節約したことを示すものではありません。</p>

      <Card className="overflow-hidden rounded-[18px] border-primary/10 bg-primary/[.045] shadow-none"><CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary"><Coins size={20} /></span><div><p className="text-[13px] font-semibold">このまま1年続けたら</p><p className="mt-1 text-[11px] text-muted-foreground">タバコ代だけで、これだけ節約</p></div></div>
        <div className="flex items-baseline gap-1 text-primary"><strong className="text-[24px] tracking-[-.055em] tabular-nums">{number(stats.annualSavings)}</strong><span className="text-xs font-semibold">円/年</span><ArrowDownRight size={16} className="ml-1" /></div>
      </CardContent></Card>

      <section className="pt-2" aria-labelledby="timeline-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[.1em] text-primary"><Heart size={13} /> MILESTONES</p><h2 id="timeline-title" className="text-[19px] font-bold tracking-[-.045em]">禁煙のあゆみ</h2></div><Badge variant="outline" className="py-1 text-muted-foreground">{MILESTONES.filter((m) => m.days <= stats.elapsedDays).length}/{MILESTONES.length} 達成</Badge></div>
        <Card className="overflow-hidden rounded-[18px]"><CardContent className="px-4 pb-2 pt-5 sm:px-5">
          <div>
            {visibleMilestones.map((m, index) => {
              const completed = stats.elapsedDays >= m.days
              const isCurrent = next?.milestone.days === m.days
              return <div key={m.days} className="relative flex gap-3 pb-5 last:pb-3">
                {index < visibleMilestones.length - 1 && <div className="absolute bottom-0 left-[15px] top-[32px] w-px bg-border" />}
                <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${completed ? 'border-primary bg-primary text-primary-foreground' : isCurrent ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-muted text-muted-foreground'}`}>
                  {completed ? <Check size={15} strokeWidth={2.5} /> : isCurrent ? <Leaf size={15} /> : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />}
                </div>
                <div className="min-w-0 flex-1 pt-0.5"><div className="flex flex-wrap items-center gap-2"><span className={`text-[11px] font-semibold ${completed ? 'text-primary' : 'text-muted-foreground'}`}>{m.label}</span>{isCurrent && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">NEXT</span>}{completed && <CheckCircle2 size={13} className="text-primary" />}</div><h3 className="mt-1 text-[13px] font-semibold">{m.title}</h3><p className="mt-1 text-[11px] leading-[1.7] text-muted-foreground">{m.description}</p>{m.isClinical && <span className="mt-1 inline-block text-[10px] text-muted-foreground">※主に紙巻きタバコの研究による目安</span>}</div>
              </div>
            })}
          </div>
          <Separator className="mb-2" />
          <Button variant="ghost" onClick={() => setShowAll(!showAll)} className="w-full gap-2 text-xs text-primary hover:bg-primary/5">{showAll ? '折りたたむ' : 'すべてのマイルストーンを見る'}{showAll ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</Button>
        </CardContent></Card>
        <div className="mt-3 flex gap-2 px-1 text-[10px] leading-[1.7] text-muted-foreground"><Info size={14} className="mt-0.5 shrink-0" /><p>健康面の変化は一般的な目安で、個人差があります。紙巻きタバコの研究結果はIQOSなどの加熱式タバコにそのまま当てはめられません。医療的な診断や治療を目的とするものではありません。</p></div>
      </section>

      <section className="rounded-[18px] border border-border bg-card p-4 sm:p-5"><div className="flex items-center gap-2 text-primary"><CalendarCheck2 size={17} /><span className="text-[13px] font-semibold">あなたの禁煙記録</span></div><p className="mt-2.5 text-[13px] leading-6 text-muted-foreground">{formatDateTime(new Date(profile.quitAt))} からスタート</p><div className="mt-3 flex items-center justify-between rounded-xl bg-muted px-3.5 py-2.5 text-[11px] text-muted-foreground"><div className="flex items-center gap-2"><BadgeCheck size={14} />あなたの記録はこの端末だけに保存</div><ArrowRight size={14} /></div></section>
    </div>
  )
}
