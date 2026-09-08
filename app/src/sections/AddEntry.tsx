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

/* ── 拍照 AI 识别 ─────────────────────────────────── */

function PhotoRecognize({
  apiKey,
  onAdd,
  onGoSettings,
}: {
  apiKey: string
  onAdd: (items: NewEntryInput[]) => void
  onGoSettings: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = useState<string | null>(null) // 识别用大图
  const [thumb, setThumb] = useState<string | null>(null) // 记录用缩略图
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dishes, setDishes] = useState<RecognizedDish[] | null>(null)
  const [meal, setMeal] = useState<MealType>('午餐')

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError('')
    setDishes(null)
    try {
      const [big, small] = await Promise.all([
        fileToDataUrl(file, 1024, 0.8),
        fileToDataUrl(file, 320, 0.6),
      ])
      setPhoto(big)
      setThumb(small)
    } catch {
      setError('图片读取失败，请换一张试试。')
    }
  }

  async function runRecognize() {
    if (!photo || !apiKey) return
    setBusy(true)
    setError('')
    try {
      const result = await recognizeFood(apiKey, photo)
      setDishes(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : '识别失败，请重试。')
    } finally {
      setBusy(false)
    }
  }

  function updateDish(i: number, patch: Partial<RecognizedDish>) {
    setDishes((prev) => prev && prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)))
  }

  if (!apiKey) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-3">
          <Camera className="h-8 w-8 mx-auto text-neutral-300" />
          <p className="text-sm text-neutral-600">
            拍照识别使用 Kimi（Moonshot）视觉模型，需要先在「设置」中填入你自己的 API Key。
          </p>
          <p className="text-xs text-neutral-400">
            API Key 只保存在本机浏览器中，不会上传到其它服务器。识别结果为估算值，仅供参考。
          </p>
          <Button variant="outline" onClick={onGoSettings}>
            去设置 API Key
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4 space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {photo ? (
            <img src={photo} alt="待识别" className="w-full max-h-64 object-contain rounded-lg border" />
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 rounded-lg border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-neutral-400 transition-colors"
            >
              <Camera className="h-6 w-6" />
              <span className="text-sm">拍摄或选择餐食照片</span>
            </button>
          )}
          <div className="flex gap-2">
            {photo && (
              <Button variant="outline" className="flex-1" onClick={() => fileRef.current?.click()}>
                换一张
              </Button>
            )}
            <Button className="flex-1" disabled={!photo || busy} onClick={runRecognize}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {busy ? '识别中…' : '开始识别'}
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-xs text-neutral-400">
            提示：照片会发送给 Moonshot API 进行识别；结果为估算值，可在下方手动修正后再保存。
          </p>
        </CardContent>
      </Card>

      {dishes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>识别结果（可修正）</span>
              <MealSelect value={meal} onChange={setMeal} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dishes.map((d, i) => (
              <div key={i} className="p-3 rounded-lg border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Input value={d.name} onChange={(e) => updateDish(i, { name: e.target.value })} className="h-8" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['carbs', 'protein', 'fat'] as const).map((k) => (
                    <div key={k}>
                      <Label className="text-xs text-neutral-500">
                        {k === 'carbs' ? '碳水(克)' : k === 'protein' ? '蛋白质(克)' : '脂肪(克)'}
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        className="h-8"
                        value={d[k]}
                        onChange={(e) => updateDish(i, { [k]: Math.max(0, Number(e.target.value) || 0) })}
                      />
                    </div>
                  ))}
                </div>
                {d.note && <p className="text-xs text-neutral-400">{d.note}</p>}
              </div>
            ))}
            <Button
              className="w-full"
              onClick={() => {
                onAdd(
                  dishes.map((d) => ({
                    name: d.name,
                    meal,
                    carbs: d.carbs,
                    protein: d.protein,
                    fat: d.fat,
                    photo: thumb ?? undefined,
                  })),
                )
                setDishes(null)
                setPhoto(null)
                setThumb(null)
              }}
            >
              全部添加到{meal}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/* ── 手动输入 ─────────────────────────────────── */

function ManualForm({ onAdd }: { onAdd: (items: NewEntryInput[]) => void }) {
  const [name, setName] = useState('')
  const [carbs, setCarbs] = useState('')
  const [protein, setProtein] = useState('')
  const [fat, setFat] = useState('')
  const [meal, setMeal] = useState<MealType>('午餐')

  const valid =
    name.trim() !== '' && (Number(carbs) > 0 || Number(protein) > 0 || Number(fat) > 0)

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-sm">名称</Label>
          <MealSelect value={meal} onChange={setMeal} />
        </div>
        <Input placeholder="如：食堂自选套餐" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs text-neutral-500">碳水(克)</Label>
            <Input type="number" min={0} value={carbs} onChange={(e) => setCarbs(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-neutral-500">蛋白质(克)</Label>
            <Input type="number" min={0} value={protein} onChange={(e) => setProtein(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-neutral-500">脂肪(克)</Label>
            <Input type="number" min={0} value={fat} onChange={(e) => setFat(e.target.value)} />
          </div>
        </div>
        <Button
          className="w-full"
          disabled={!valid}
          onClick={() => {
            onAdd([
              {
                name: name.trim(),
                meal,
                carbs: Number(carbs) || 0,
                protein: Number(protein) || 0,
                fat: Number(fat) || 0,
              },
            ])
            setName('')
            setCarbs('')
            setProtein('')
            setFat('')
          }}
        >
          添加到{meal}
        </Button>
      </CardContent>
    </Card>
  )
}
