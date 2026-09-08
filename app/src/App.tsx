import { useEffect, useState } from 'react'
import { CalendarDays, PlusCircle, List, Settings as SettingsIcon } from 'lucide-react'
import { TodayView } from '@/sections/TodayView'
import { AddEntry, type NewEntryInput } from '@/sections/AddEntry'
import { ReferenceView } from '@/sections/ReferenceView'
import { SettingsView } from '@/sections/SettingsView'
import {
  loadApiKey,
  loadEntries,
  loadTargets,
  saveApiKey,
  saveEntries,
  saveTargets,
  todayStr,
  uid,
} from '@/lib/store'
import type { Entry, Targets } from '@/types'

type Tab = 'today' | 'add' | 'reference' | 'settings'

const TABS: { key: Tab; label: string; icon: typeof CalendarDays }[] = [
  { key: 'today', label: '今日', icon: CalendarDays },
  { key: 'add', label: '记录', icon: PlusCircle },
  { key: 'reference', label: '分量参考', icon: List },
  { key: 'settings', label: '设置', icon: SettingsIcon },
]

export default function App() {
  const [tab, setTab] = useState<Tab>(() => {
    const h = window.location.hash.replace('#', '')
    return (TABS.some((t) => t.key === h) ? h : 'today') as Tab
  })
  const [date, setDate] = useState(todayStr())
  const [targets, setTargets] = useState<Targets>(loadTargets)
  const [entries, setEntries] = useState<Entry[]>(loadEntries)
  const [apiKey, setApiKey] = useState(loadApiKey)

  useEffect(() => saveTargets(targets), [targets])
  useEffect(() => saveEntries(entries), [entries])
  useEffect(() => saveApiKey(apiKey), [apiKey])

  function addEntries(items: NewEntryInput[]) {
    const now = Date.now()
    setEntries((prev) => [
      ...prev,
      ...items.map((it, i) => ({
        id: uid(),
        date,
        meal: it.meal,
        name: it.name,
        carbs: it.carbs,
        protein: it.protein,
        fat: it.fat,
        photo: it.photo,
        createdAt: now + i,
      })),
    ])
    setTab('today')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
        <header className="mb-5">
          <h1 className="text-xl font-bold tracking-tight">碳蛋脂记录</h1>
          <p className="text-xs text-neutral-400 mt-0.5">记录每日碳水 · 蛋白质 · 脂肪摄入</p>
        </header>

        {tab === 'today' && (
          <TodayView
            date={date}
            onDateChange={setDate}
            entries={entries}
            targets={targets}
            onDelete={(id) => setEntries((prev) => prev.filter((e) => e.id !== id))}
            onGoAdd={() => setTab('add')}
          />
        )}
        {tab === 'add' && (
          <AddEntry apiKey={apiKey} onAdd={addEntries} onGoSettings={() => setTab('settings')} />
        )}
        {tab === 'reference' && <ReferenceView targets={targets} />}
        {tab === 'settings' && (
          <SettingsView
            targets={targets}
            onSaveTargets={setTargets}
            apiKey={apiKey}
            onSaveApiKey={setApiKey}
            onClearAll={() => {
              setEntries([])
              setTargets({ carbs: 250, protein: 120, fat: 65 })
            }}
          />
        )}
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200">
        <div className="mx-auto max-w-lg grid grid-cols-4">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                tab === key ? 'text-emerald-700 font-medium' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
