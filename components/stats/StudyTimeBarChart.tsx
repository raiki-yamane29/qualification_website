'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { StudyLog } from '@/types'

type Props = { logs: StudyLog[] }

const BUCKETS = [
  { label: '〜10h', max: 600 },
  { label: '10〜30h', max: 1800 },
  { label: '30〜50h', max: 3000 },
  { label: '50〜100h', max: 6000 },
  { label: '100〜200h', max: 12000 },
  { label: '200h〜', max: Infinity },
]

export function StudyTimeBarChart({ logs }: Props) {
  const passedLogs = logs.filter((l) => l.status === '合格した')

  if (passedLogs.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">合格者のデータがありません</p>
  }

  const counts = BUCKETS.map((b, i) => {
    const prev = i === 0 ? 0 : BUCKETS[i - 1].max
    return {
      label: b.label,
      count: passedLogs.filter((l) => l.minutes > prev && l.minutes <= b.max).length,
    }
  })

  const avgMinutes = Math.round(passedLogs.reduce((s, l) => s + l.minutes, 0) / passedLogs.length)
  const avgHours = (avgMinutes / 60).toFixed(1)

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground text-center">
        合格者の平均学習時間: <span className="font-semibold text-foreground">{avgHours}時間</span>
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={counts} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${value} 人`, '合格者数']} />
          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
