'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { StudyLog } from '@/types'

type Props = { logs: StudyLog[] }

export function PassAvgBarChart({ logs }: Props) {
  const passedLogs = logs.filter((l) => l.status === '合格した')

  const sums: Record<string, { total: number; count: number }> = {}
  for (const log of passedLogs) {
    const title = log.materials?.title ?? '不明'
    if (!sums[title]) sums[title] = { total: 0, count: 0 }
    sums[title].total += log.minutes
    sums[title].count++
  }

  const data = Object.entries(sums)
    .map(([name, { total, count }]) => ({
      name: name.length > 12 ? name.slice(0, 12) + '…' : name,
      avg: Math.round(total / count),
    }))
    .sort((a, b) => b.avg - a.avg)

  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">合格者のデータがありません</p>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-30} textAnchor="end" tick={{ fontSize: 12 }} />
        <YAxis unit="分" tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value} 分`, '平均学習時間']} />
        <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
