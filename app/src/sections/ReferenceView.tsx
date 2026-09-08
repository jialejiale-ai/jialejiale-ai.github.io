import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FOODS } from '@/data/foods'
import type { Targets } from '@/types'

interface ReferenceViewProps {
  targets: Targets
}

/** 各类营养素对应的主要食物来源类别 */
const MACRO_SOURCES: Record<'carbs' | 'protein' | 'fat', string[]> = {
  carbs: ['主食', '蔬果'],
  protein: ['蛋白质', '饮品'],
  fat: ['脂肪坚果', '外食菜品'],
}

const MACRO_LABEL = { carbs: '碳水化合物', protein: '蛋白质', fat: '脂肪' } as const
const MACRO_COLOR = { carbs: 'bg-amber-500', protein: 'bg-sky-600', fat: 'bg-rose-400' } as const

function fmtNeed(units: number, unitDesc: string): string {
  if (units >= 100) return `约 ${Math.round(units)} × ${unitDesc}`
  if (units >= 10) return `约 ${units.toFixed(0)} × ${unitDesc}`
  return `约 ${units.toFixed(1)} × ${unitDesc}`
}

export function ReferenceView({ targets }: ReferenceViewProps) {
  const sections = useMemo(
    () =>
      (['carbs', 'protein', 'fat'] as const).map((macro) => {
        const foods = FOODS.filter(
          (f) => MACRO_SOURCES[macro].includes(f.category) && f.perUnit[macro] > 0,
        )
          // 按每单位该营养素含量降序
          .sort((a, b) => b.perUnit[macro] - a.perUnit[macro])
          .slice(0, 10)
        return { macro, foods }
      }),
    [],
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500">
        按照你当前的每日目标（碳 {targets.carbs} / 蛋 {targets.protein} / 脂 {targets.fat} 克），
        以下是单一食物达到全天目标所需的大致分量，用于建立分量直觉——日常饮食应多种食物搭配，而非只吃一种。
      </p>

      {sections.map(({ macro, foods }) => (
        <Card key={macro}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full ${MACRO_COLOR[macro]}`} />
              {MACRO_LABEL[macro]} {targets[macro]} 克 ≈
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="divide-y divide-neutral-100">
              {foods.map((f) => (
                <li key={macro + f.id + f.unitDesc} className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-sm">{f.name}</span>
                    {f.estimated && (
                      <Badge variant="outline" className="ml-1.5 text-[10px] px-1 py-0 text-neutral-400">
                        估算
                      </Badge>
                    )}
                    <div className="text-xs text-neutral-400">
                      {f.unitDesc} 含 {MACRO_LABEL[macro].slice(0, 2)} {f.perUnit[macro]} 克
                    </div>
                  </div>
                  <span className="text-sm text-neutral-700 tabular-nums whitespace-nowrap">
                    {fmtNeed(targets[macro] / f.perUnit[macro], f.unitDesc)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      <p className="text-xs text-neutral-400 leading-relaxed">
        数据说明：家常食物数据参考《中国食物成分表》常见值，米饭面条等按熟重计；标注「估算」的外食菜品按常见餐厅分量估计，实际会因做法与分量浮动，仅供分量参考。
      </p>
    </div>
  )
}
