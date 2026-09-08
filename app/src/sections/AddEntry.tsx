import { useMemo, useRef, useState } from 'react'
import { Camera, Loader2, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FOODS, FOOD_CATEGORIES } from '@/data/foods'
import { fileToDataUrl, recognizeFood, type RecognizedDish } from '@/lib/ai'
import { MEALS, kcal, type Food, type MealType } from '@/types'

export interface NewEntryInput {
  name: string
  meal: MealType
  carbs: number
  protein: number
  fat: number
  photo?: string
}

interface AddEntryProps {
  apiKey: string
  onAdd: (items: NewEntryInput[]) => void
  onGoSettings: () => void
}

export function AddEntry({ apiKey, onAdd, onGoSettings }: AddEntryProps) {
  return (
    <Tabs defaultValue="library">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="library">食物库</TabsTrigger>
        <TabsTrigger value="photo">拍照识别</TabsTrigger>
        <TabsTrigger value="manual">手动输入</TabsTrigger>
      </TabsList>
      <TabsContent value="library" className="mt-4">
        <LibraryPicker onAdd={onAdd} />
      </TabsContent>
      <TabsContent value="photo" className="mt-4">
        <PhotoRecognize apiKey={apiKey} onAdd={onAdd} onGoSettings={onGoSettings} />
      </TabsContent>
      <TabsContent value="manual" className="mt-4">
        <ManualForm onAdd={onAdd} />
      </TabsContent>
    </Tabs>
  )
}

function MealSelect({ value, onChange }: { value: MealType; onChange: (m: MealType) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as MealType)}>
      <SelectTrigger className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MEALS.map((m) => (
          <SelectItem key={m} value={m}>
            {m}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/* ── 食物库快选 ─────────────────────────────────── */

function LibraryPicker({ onAdd }: { onAdd: (items: NewEntryInput[]) => void }) {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState<string>('全部')
  const [selected, setSelected] = useState<Food | null>(null)
  const [qty, setQty] = useState(1)
  const [meal, setMeal] = useState<MealType>('午餐')

  const filtered = useMemo(
    () =>
      FOODS.filter(
        (f) =>
          (category === '全部' || f.category === category) &&
          (keyword.trim() === '' || f.name.includes(keyword.trim())),
      ),
    [keyword, category],
  )

  const preview = selected
    ? {
        carbs: selected.perUnit.carbs * qty,
        protein: selected.perUnit.protein * qty,
        fat: selected.perUnit.fat * qty,
      }
    : null

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          className="pl-9"
          placeholder="搜索食物，如：鸡胸肉"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {['全部', ...FOOD_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              category === c
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
        {filtered.map((f) => (
          <button
            key={f.id + f.unitDesc}
            onClick={() => {
              setSelected(f)
              setQty(1)
            }}
            className={`text-left p-3 rounded-lg border transition-colors ${
              selected === f ? 'border-emerald-600 bg-emerald-50' : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{f.name}</span>
              {f.estimated && (
                <Badge variant="outline" className="text-[10px] px-1 py-0 text-neutral-400">
                  估算
                </Badge>
              )}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              {f.unitDesc} · 碳 {f.perUnit.carbs} 蛋 {f.perUnit.protein} 脂 {f.perUnit.fat}
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-neutral-400 col-span-2 py-6 text-center">
            没有找到「{keyword}」，试试「手动输入」
          </p>
        )}
      </div>

      {selected && preview && (
        <Card className="border-emerald-600/40">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-sm font-medium">{selected.name}</div>
              <MealSelect value={meal} onChange={setMeal} />
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-sm text-neutral-500 shrink-0">数量（{selected.unitDesc}）</Label>
              <Input
                type="number"
                min={0.25}
                step={0.25}
                value={qty}
                onChange={(e) => setQty(Math.max(0, Number(e.target.value) || 0))}
                className="w-24"
              />
            </div>
            <div className="text-sm text-neutral-600 tabular-nums">
              合计：碳水 {preview.carbs.toFixed(1)} 克 · 蛋白质 {preview.protein.toFixed(1)} 克 · 脂肪{' '}
              {preview.fat.toFixed(1)} 克（约 {kcal(preview)} 千卡）
            </div>
            <Button
              className="w-full"
              onClick={() => {
                onAdd([
                  {
                    name: `${selected.name} ×${qty}（${selected.unitDesc}）`,
                    meal,
                    carbs: Math.round(preview.carbs * 10) / 10,
                    protein: Math.round(preview.protein * 10) / 10,
                    fat: Math.round(preview.fat * 10) / 10,
                  },
                ])
                setSelected(null)
              }}
            >
              添加到{meal}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
