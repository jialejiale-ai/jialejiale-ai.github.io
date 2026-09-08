import type { Entry, Targets } from '@/types'

const KEY_TARGETS = 'macro-tracker:targets'
const KEY_ENTRIES = 'macro-tracker:entries'
const KEY_APIKEY = 'macro-tracker:moonshot-key'

export const DEFAULT_TARGETS: Targets = { carbs: 250, protein: 120, fat: 65 }

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage 满等情况静默失败
  }
}

export function loadTargets(): Targets {
  return read(KEY_TARGETS, DEFAULT_TARGETS)
}
export function saveTargets(t: Targets) {
  write(KEY_TARGETS, t)
}

export function loadEntries(): Entry[] {
  return read(KEY_ENTRIES, [])
}
export function saveEntries(list: Entry[]) {
  write(KEY_ENTRIES, list)
}

export function loadApiKey(): string {
  return read(KEY_APIKEY, '')
}
export function saveApiKey(k: string) {
  write(KEY_APIKEY, k)
}

export function todayStr(): string {
  const d = new Date()
  return toDateStr(d)
}

export function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toDateStr(d)
}

export function fmtDateCn(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
  return `${d.getMonth() + 1}月${d.getDate()}日 周${week}`
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
