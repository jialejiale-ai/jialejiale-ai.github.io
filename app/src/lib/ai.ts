import type { MacroSet } from '@/types'

export interface RecognizedDish {
  name: string
  carbs: number
  protein: number
  fat: number
  note?: string
}

/** 把用户选择的图片缩放为 dataURL（识别用大图 / 记录用缩略图） */
export async function fileToDataUrl(
  file: File,
  maxSide: number,
  quality = 0.8,
): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', quality)
}

/**
 * 调用 Moonshot（Kimi）视觉模型识别菜品并估算碳蛋脂。
 * 需要用户在设置中填入自己的 API Key（仅保存在本机 localStorage）。
 */
export async function recognizeFood(
  apiKey: string,
  imageDataUrl: string,
): Promise<RecognizedDish[]> {
  const prompt = `你是营养估算助手。请识别这张图片中的所有食物/菜品，并估算每道菜的碳水化合物、蛋白质、脂肪含量（单位：克）。
要求：
1. 按常见餐厅一份的分量估算；如果是套餐，请拆成多个菜品。
2. 只输出 JSON，不要输出任何其它文字。格式：
{"dishes":[{"name":"菜品名","carbs":30,"protein":20,"fat":10,"note":"估算依据，如分量约300克"}]}
3. 数值为整数估算值，宁保守勿夸张。
4. 如果图片中没有食物，输出 {"dishes":[]}`

  const resp = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'moonshot-v1-8k-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageDataUrl } },
            { type: 'text', text: prompt },
          ],
        },
      ],
      temperature: 0.2,
    }),
  })

  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    if (resp.status === 401) throw new Error('API Key 无效或已过期，请在「设置」中检查。')
    throw new Error(`识别服务返回错误（HTTP ${resp.status}）。${text.slice(0, 120)}`)
  }

  const data = await resp.json()
  const content: string = data?.choices?.[0]?.message?.content ?? ''
  const match = content.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('识别结果格式异常，请重试或改用手动录入。')

  let parsed: { dishes?: RecognizedDish[] }
  try {
    parsed = JSON.parse(match[0])
  } catch {
    throw new Error('识别结果解析失败，请重试或改用手动录入。')
  }
  const dishes = (parsed.dishes ?? []).map((d) => ({
    name: String(d.name ?? '未命名菜品'),
    carbs: Math.max(0, Math.round(Number(d.carbs) || 0)),
    protein: Math.max(0, Math.round(Number(d.protein) || 0)),
    fat: Math.max(0, Math.round(Number(d.fat) || 0)),
    note: d.note ? String(d.note) : undefined,
  }))
  if (dishes.length === 0) throw new Error('没有识别到食物，可以换一张更清晰的照片，或改用手动录入。')
  return dishes
}

export function dishesTotal(dishes: RecognizedDish[]): MacroSet {
  return dishes.reduce(
    (acc, d) => ({
      carbs: acc.carbs + d.carbs,
      protein: acc.protein + d.protein,
      fat: acc.fat + d.fat,
    }),
    { carbs: 0, protein: 0, fat: 0 },
  )
}
