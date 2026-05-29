'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { StudyLog } from '@/types'

type Props = { logs: StudyLog[] }

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6']

export function MaterialPieChart({ logs }: Props) {
  const counts: Record<string, { name: string; value: number }> = {}
  for (const log of logs) {
    const title = log.materials?.title ?? '不明'
    if (!counts[title]) counts[title] = { name: title, value: 0 }
    counts[title].value++
  }
  const data = Object.values(counts).sort((a, b) => b.value - a.value).slice(0, 8)

  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">データがありません</p>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ percent }: { percent?: number }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} 件`, '使用数']} />
        <Legend formatter={(value) => value.length > 15 ? value.slice(0, 15) + '…' : value} />
      </PieChart>
    </ResponsiveContainer>
  )
}
