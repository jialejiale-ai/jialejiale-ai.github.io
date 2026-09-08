import { Progress } from '@/components/ui/progress'

interface MacroBarProps {
  label: string
  consumed: number
  target: number
  colorClass: string // 进度条颜色，如 'bg-amber-500'
}

export function MacroBar({ label, consumed, target, colorClass }: MacroBarProps) {
  const pct = target > 0 ? Math.min(100, (consumed / target) * 100) : 0
  const over = target > 0 && consumed > target
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm tabular-nums text-neutral-500">
          <span className={over ? 'text-red-600 font-semibold' : 'text-neutral-900 font-semibold'}>
            {Math.round(consumed)}
          </span>
          {' / '}
          {Math.round(target)} 克
        </span>
      </div>
      <Progress
        value={pct}
        className="h-2 bg-neutral-100"
        indicatorClassName={over ? 'bg-red-500' : colorClass}
      />
    </div>
  )
}
