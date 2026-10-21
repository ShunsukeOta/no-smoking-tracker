import { useState } from 'react'
import { ArrowDownRight, ArrowRight, BadgeCheck, CalendarCheck2, Check, CheckCircle2, ChevronDown, ChevronUp, CigaretteOff, Clock3, Coins, Heart, Info, Leaf, TrendingUp, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { formatDateTime, formatRemaining, getNextMilestone, getQuitStats, MILESTONES, type QuitProfile } from '@/lib/tracker'

const numberFormatter = new Intl.NumberFormat('ja-JP')
const number = (value: number) => numberFormatter.format(value)

function elapsedParts(elapsedMs: number) {
  const totalHours = Math.floor(elapsedMs / (60 * 60 * 1000))
  const days = Math.floor(totalHours / 24)
  const minutes = Math.floor((elapsedMs % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((elapsedMs % (60 * 1000)) / 1000)
  return { totalHours, days, hours: totalHours % 24, minutes, seconds }
}

export default function Dashboard({ profile, now }: { profile: QuitProfile; now: number }) {
  const [showAll, setShowAll] = useState(false)
  const stats = getQuitStats(profile, now)
  const elapsed = elapsedParts(stats.elapsedMs)
  const next = getNextMilestone(stats.elapsedDays)
  const visibleMilestones = showAll ? MILESTONES : MILESTONES.slice(0, 6)

  return (
    <div className="space-y-5 pb-12 sm:space-y-6">
      <section className="mb-6 flex items-end justify-between gap-4 pt-3 sm:mb-7 sm:pt-5">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-[.12em] text-[#36866a]"><Leaf size={14} /> YOUR PROGRESS</p>
          <h1 className="text-[26px] font-bold tracking-[-.055em] sm:text-[32px]">今日も、吸わない。</h1>
          <p className="mt-1.5 text-[13px] text-muted-foreground">{profile.age}歳から始めた、小さな大きな変化。</p>
        </div>
        <Badge variant="secondary" className="mb-1 shrink-0 border border-emerald-100 bg-[#e9f5eb] py-2 text-[#277452]"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#34986a]" />継続中</Badge>
      </section>

      <section aria-label="禁煙継続時間" className="relative isolate overflow-hidden rounded-[26px] bg-[#153e32] p-6 text-white shadow-float sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#7cce9a]/15 blur-[4px]" />
        <div className="pointer-events-none absolute -bottom-48 right-10 h-72 w-72 rounded-full border-[50px] border-white/[.045]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 text-[13px] text-[#b8d8c6]"><span className="flex items-center gap-2"><Clock3 size={16} />禁煙を続けている時間</span><CigaretteOff size={20} className="text-[#c1e6a8]" /></div>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular">
            {elapsed.totalHours < 72 ? (
              <><span className="text-[clamp(3.2rem,11vw,5.5rem)] font-semibold leading-none tracking-[-.075em]">{number(elapsed.totalHours)}</span><span className="mr-2 text-lg font-medium text-[#d3efdb]">時間</span><span className="text-[clamp(3.2rem,11vw,5.5rem)] font-semibold leading-none tracking-[-.075em]">{String(elapsed.minutes).padStart(2, '0')}</span><span className="text-lg font-medium text-[#d3efdb]">分</span></>
            ) : (
              <><span className="text-[clamp(3.2rem,11vw,5.5rem)] font-semibold leading-none tracking-[-.075em]">{number(elapsed.days)}</span><span className="mr-2 text-lg font-medium text-[#d3efdb]">日</span><span className="text-[clamp(3.2rem,11vw,5.5rem)] font-semibold leading-none tracking-[-.075em]">{elapsed.hours}</span><span className="mr-2 text-lg font-medium text-[#d3efdb]">時間</span><span className="text-2xl font-semibold tracking-[-.05em]">{String(elapsed.minutes).padStart(2, '0')}</span><span className="text-sm text-[#d3efdb]">分</span></>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#a6ccba]"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[#9fe4ab]" /><span>いまもカウント中</span><span className="tabular opacity-75">{String(elapsed.seconds).padStart(2, '0')}秒</span></div>
          <div className="mt-7 border-t border-white/15 pt-5 sm:mt-8">
            <div className="mb-3 flex items-center justify-between gap-2"><span className="text-xs font-medium text-[#bddcca]">次のマイルストーン</span><span className="text-xs font-semibold text-[#c5efa7]">{next ? `${next.milestone.label}達成まで ${formatRemaining(next.remainingMs)}` : 'すべて達成！'}</span></div>
            <Progress value={next?.progress ?? 100} className="h-2.5 bg-white/15 [&>div]:bg-[#b8ef97]" />
            <div className="mt-3 flex items-center justify-between gap-3"><p className="text-sm font-medium text-[#ecfff3]">{next?.milestone.title ?? '積み重ねた日々が力になっています'}</p><span className="text-xs tabular text-[#a6c7b5]">{Math.floor(next?.progress ?? 100)}%</span></div>
          </div>
        </div>
      </section>

      <section aria-label="禁煙の成果" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <Card className="col-span-2 rounded-[20px] border-[#e5ebe5] bg-white sm:col-span-1">
          <CardContent className="p-5 sm:p-5">
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#e8f6ed] text-[#267e59]"><Wallet size={20} /></div>
            <div className="text-xs text-muted-foreground">節約できたお金</div>
            <div className="mt-2 flex items-baseline gap-1"><strong className="text-[32px] font-semibold tracking-[-.06em] tabular sm:text-[29px]">{number(stats.savedYen)}</strong><span className="text-sm font-medium text-muted-foreground">円</span></div>
            <div className="mt-2 flex items-center gap-1 text-xs text-[#318365]"><TrendingUp size={14} /> 毎日増えています</div>
          </CardContent>
        </Card>
        <Card className="rounded-[20px] border-[#e5ebe5] bg-white"><CardContent className="p-5">
          <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#fff1e6] text-[#b36b26]"><CigaretteOff size={20} /></div>
          <div className="text-xs text-muted-foreground">吸わなかった本数</div>
          <div className="mt-2 flex items-baseline gap-1"><strong className="text-[31px] font-semibold tracking-[-.06em] tabular sm:text-[29px]">{number(stats.avoidedCigarettes)}</strong><span className="text-sm font-medium text-muted-foreground">本</span></div>
          <div className="mt-2 text-xs text-muted-foreground">以前の1日{profile.cigarettesPerDay}本から試算</div>
        </CardContent></Card>
        <Card className="rounded-[20px] border-[#e5ebe5] bg-white"><CardContent className="p-5">
          <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#eaf0ff] text-[#6178b9]"><Clock3 size={20} /></div>
          <div className="text-xs text-muted-foreground">取り戻した時間</div>
          <div className="mt-2 flex items-baseline gap-1"><strong className="text-[31px] font-semibold tracking-[-.06em] tabular sm:text-[29px]">{stats.reclaimedMinutes >= 60 ? number(Math.floor(stats.reclaimedMinutes / 60)) : number(stats.reclaimedMinutes)}</strong><span className="text-sm font-medium text-muted-foreground">{stats.reclaimedMinutes >= 60 ? '時間' : '分'}</span></div>
          <div className="mt-2 text-xs text-muted-foreground">1本5分の仮定で試算</div>
        </CardContent></Card>
      </section>

      <Card className="overflow-hidden rounded-[20px] border-[#e5ebe5] bg-[#f0f5ed] shadow-none">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/90 text-[#30805a]"><Coins size={23} /></span><div><p className="text-sm font-semibold text-[#254337]">このまま1年続けたら</p><p className="mt-1 text-xs text-[#6f8679]">タバコ代だけで、これだけ節約</p></div></div>
          <div className="flex items-baseline gap-1 text-[#1c6c4d]"><strong className="text-[27px] tracking-[-.06em] tabular">{number(stats.annualSavings)}</strong><span className="text-sm font-semibold">円/年</span><ArrowDownRight size={18} className="ml-1" /></div>
        </CardContent>
      </Card>

      <section className="pt-2" aria-labelledby="timeline-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-5"><div><p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-[.1em] text-[#438d6f]"><Heart size={14} /> MILESTONES</p><h2 id="timeline-title" className="text-[22px] font-bold tracking-[-.045em]">禁煙のあゆみ</h2></div><Badge variant="outline" className="bg-white/80 py-1.5 text-muted-foreground">{MILESTONES.filter((m) => m.days <= stats.elapsedDays).length}/{MILESTONES.length} 達成</Badge></div>
        <Card className="overflow-hidden rounded-[20px] border-[#e5ebe5]"><CardContent className="px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
          <div className="space-y-0">
            {visibleMilestones.map((m, index) => {
              const completed = stats.elapsedDays >= m.days
              const isCurrent = next?.milestone.days === m.days
              return <div key={m.days} className="relative flex gap-4 pb-6 last:pb-4">
                {index < visibleMilestones.length - 1 && <div className="absolute bottom-0 left-[18px] top-[36px] w-px bg-[#e4e9e4]" />}
                <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${completed ? 'border-[#24845b] bg-[#24845b] text-white' : isCurrent ? 'border-[#a2c7ad] bg-[#e9f4e9] text-[#327e58]' : 'border-[#e5eae5] bg-[#f6f7f5] text-[#aeb9b2]'}`}>
                  {completed ? <Check size={17} strokeWidth={2.5} /> : isCurrent ? <Leaf size={16} /> : <span className="h-1.5 w-1.5 rounded-full bg-[#b9c5bf]" />}
                </div>
                <div className="min-w-0 flex-1 pt-0.5"><div className="flex flex-wrap items-center gap-2"><span className={`text-xs font-semibold ${completed ? 'text-[#287e5b]' : 'text-muted-foreground'}`}>{m.label}</span>{isCurrent && <span className="rounded-full bg-[#e6f2e9] px-2 py-0.5 text-[10px] font-semibold text-[#307955]">NEXT</span>}{completed && <CheckCircle2 size={14} className="text-[#2b835e]" />}</div><h3 className={`mt-1.5 text-sm font-semibold ${!completed && !isCurrent ? 'text-[#526359]' : 'text-foreground'}`}>{m.title}</h3><p className="mt-1 text-xs leading-[1.8] text-muted-foreground">{m.description}</p>{m.isClinical && <span className="mt-1 inline-block text-[10px] text-[#769287]">※主に紙巻きタバコの研究による目安</span>}</div>
              </div>
            })}
          </div>
          <Separator className="mb-2" />
          <Button variant="ghost" onClick={() => setShowAll(!showAll)} className="w-full gap-2 text-[#28795a] hover:bg-[#f3f7f2]">{showAll ? '折りたたむ' : 'すべてのマイルストーンを見る'}{showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</Button>
        </CardContent></Card>
        <div className="mt-3 flex gap-2 px-1 text-[11px] leading-[1.8] text-muted-foreground"><Info size={15} className="mt-0.5 shrink-0" /><p>健康面の変化は一般的な目安で、個人差があります。紙巻きタバコの研究結果はIQOSなどの加熱式タバコにそのまま当てはめられません。医療的な診断や治療を目的とするものではありません。</p></div>
      </section>

      <section className="rounded-[20px] border border-[#e5ebe5] bg-white p-5 sm:p-6"><div className="flex items-center gap-2 text-[#276f52]"><CalendarCheck2 size={18} /><span className="text-sm font-semibold">あなたの禁煙記録</span></div><p className="mt-3 text-sm leading-7 text-muted-foreground">{formatDateTime(new Date(profile.quitAt))} からスタート</p><div className="mt-4 flex items-center justify-between rounded-xl bg-[#f7faf6] px-4 py-3 text-xs text-[#668174]"><div className="flex items-center gap-2"><BadgeCheck size={15} />あなたの記録はこの端末だけに保存</div><ArrowRight size={14} /></div></section>
      <div className="flex items-center justify-center gap-2 pb-2 text-center text-xs text-muted-foreground"><Leaf size={14} /> 1本吸わない。その積み重ねが未来を変えます。</div>
    </div>
  )
}
