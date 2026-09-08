import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MacroBar } from '@/components/MacroBar'
import { MEALS, kcal, type Entry, type MealType, type Targets } from '@/types'
import { fmtDateCn, shiftDate, todayStr } from '@/lib/store'

interface TodayViewProps {
  date: string
  onDateChange: (d: string) => void
  entries: Entry[]
  targets: Targets
  onDelete: (id: string) => void
  onGoAdd: () => void
}

export function TodayView({ date, onDateChange, entries, targets, onDelete, onGoAdd }: TodayViewProps) {
  const dayEntries = useMemo(
    () => entries.filter((e) => e.date === date).sort((a, b) => a.createdAt - b.createdAt),
    [entries, date],
  )

  const total = useMemo(
    () =>
      dayEntries.reduce(
        (acc, e) => ({ carbs: acc.carbs + e.carbs, protein: acc.protein + e.protein, fat: acc.fat + e.fat }),
        { carbs: 0, protein: 0, fat: 0 },
      ),
    [dayEntries],
  )

  const isToday = date === todayStr()

  return (
    <div className="space-y-4">
      {/* 日期导航 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => onDateChange(shiftDate(date, -1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <div className="font-semibold">{fmtDateCn(date)}</div>
          {!isToday && (
            <button
              className="text-xs text-emerald-700 hover:underline"
              onClick={() => onDateChange(todayStr())}
            >
              回到今天
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          disabled={isToday}
          onClick={() => onDateChange(shiftDate(date, 1))}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* 今日进度 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-baseline justify-between">
            <span>摄入进度</span>
            <span className="text-sm font-normal text-neutral-500 tabular-nums">
              约 {kcal(total)} 千卡
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MacroBar label="碳水化合物" consumed={total.carbs} target={targets.carbs} colorClass="bg-amber-500" />
          <MacroBar label="蛋白质" consumed={total.protein} target={targets.protein} colorClass="bg-sky-600" />
          <MacroBar label="脂肪" consumed={total.fat} target={targets.fat} colorClass="bg-rose-400" />
        </CardContent>
      </Card>

      {/* 记录列表 */}
      {MEALS.map((meal) => {
        const list = dayEntries.filter((e) => e.meal === meal)
        if (list.length === 0) return null
        return <MealGroup key={meal} meal={meal} list={list} onDelete={onDelete} />
      })}

      {dayEntries.length === 0 && (
        <div className="text-center py-10 text-neutral-400 text-sm">
          <p>这一天还没有记录</p>
          <Button variant="outline" className="mt-4" onClick={onGoAdd}>
            记一笔
          </Button>
        </div>
      )}
    </div>
  )
}

function MealGroup({
  meal,
  list,
  onDelete,
}: {
  meal: MealType
  list: Entry[]
  onDelete: (id: string) => void
}) {
  const sub = list.reduce(
    (acc, e) => ({ carbs: acc.carbs + e.carbs, protein: acc.protein + e.protein, fat: acc.fat + e.fat }),
    { carbs: 0, protein: 0, fat: 0 },
  )
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-baseline justify-between">
          <span>{meal}</span>
          <span className="text-xs font-normal text-neutral-500 tabular-nums">
            碳 {Math.round(sub.carbs)} · 蛋 {Math.round(sub.protein)} · 脂 {Math.round(sub.fat)} 克
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y divide-neutral-100">
          {list.map((e) => (
            <li key={e.id} className="py-2.5 flex items-center gap-3">
              {e.photo && (
                <img
                  src={e.photo}
                  alt=""
                  className="h-10 w-10 rounded-md object-cover border border-neutral-200 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{e.name}</div>
                <div className="text-xs text-neutral-500 tabular-nums">
                  碳 {Math.round(e.carbs)} · 蛋 {Math.round(e.protein)} · 脂 {Math.round(e.fat)} 克 · {kcal(e)} 千卡
                </div>
              </div>
              <Badge variant="secondary" className="shrink-0 hidden sm:inline-flex">
                {e.meal}
              </Badge>
              <button
                className="text-neutral-300 hover:text-red-500 transition-colors shrink-0"
                onClick={() => onDelete(e.id)}
                aria-label="删除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
