import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { kcal, type Targets } from '@/types'

interface SettingsViewProps {
  targets: Targets
  onSaveTargets: (t: Targets) => void
  apiKey: string
  onSaveApiKey: (k: string) => void
  onClearAll: () => void
}

export function SettingsView({ targets, onSaveTargets, apiKey, onSaveApiKey, onClearAll }: SettingsViewProps) {
  const [form, setForm] = useState<Targets>({ ...targets })
  const [keyInput, setKeyInput] = useState(apiKey)
  const [weight, setWeight] = useState('')
  const [saved, setSaved] = useState(false)

  function setField(k: keyof Targets, v: string) {
    setForm((prev) => ({ ...prev, [k]: Math.max(0, Number(v) || 0) }))
    setSaved(false)
  }

  /** 按体重估算：碳 3 g/kg，蛋白 1.8 g/kg，脂肪 1 g/kg（常见健身维持/塑形区间） */
  function estimateByWeight() {
    const w = Number(weight)
    if (!w || w <= 0) return
    setForm({
      carbs: Math.round(w * 3),
      protein: Math.round(w * 1.8),
      fat: Math.round(w * 1),
    })
    setSaved(false)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">每日目标</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-neutral-500">碳水(克)</Label>
              <Input type="number" min={0} value={form.carbs} onChange={(e) => setField('carbs', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-neutral-500">蛋白质(克)</Label>
              <Input type="number" min={0} value={form.protein} onChange={(e) => setField('protein', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-neutral-500">脂肪(克)</Label>
              <Input type="number" min={0} value={form.fat} onChange={(e) => setField('fat', e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-neutral-400 tabular-nums">当前目标约 {kcal(form)} 千卡 / 天</p>

          <div className="rounded-lg bg-neutral-50 p-3 space-y-2">
            <Label className="text-xs text-neutral-500">按体重快速估算（健身塑形常用系数）</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                placeholder="体重（公斤）"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <Button variant="outline" onClick={estimateByWeight} className="shrink-0">
                估算
              </Button>
            </div>
            <p className="text-[11px] text-neutral-400">系数：碳水 3、蛋白质 1.8、脂肪 1（克/公斤体重）</p>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              onSaveTargets(form)
              setSaved(true)
            }}
          >
            {saved ? '已保存 ✓' : '保存目标'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">拍照识别（Kimi 视觉模型）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label className="text-xs text-neutral-500">Moonshot API Key</Label>
          <Input
            type="password"
            placeholder="sk-..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <p className="text-xs text-neutral-400 leading-relaxed">
            在 platform.moonshot.cn 创建 API Key 后粘贴到此处。Key 仅保存在本机浏览器 localStorage，
            仅在你点击「开始识别」时用于调用 Moonshot 接口。
          </p>
          <Button variant="outline" className="w-full" onClick={() => onSaveApiKey(keyInput.trim())}>
            保存 API Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">数据</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-neutral-400 mb-3">
            所有记录都保存在本机浏览器中，清除浏览器数据会丢失记录。
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                清空全部记录
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认清空？</AlertDialogTitle>
                <AlertDialogDescription>
                  将删除所有每日记录与目标设置（API Key 保留）。此操作不可撤销。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={onClearAll}>确认清空</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
