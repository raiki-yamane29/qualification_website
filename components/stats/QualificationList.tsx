'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Qualification, StudyLog } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, Clock, Users } from 'lucide-react'

type QualificationStats = Qualification & {
  count: number
  avgHours: number
}

type Props = {
  qualifications: Qualification[]
  logs: Pick<StudyLog, 'qualification_id' | 'hours' | 'status'>[]
}

function buildStats(qualifications: Qualification[], logs: Props['logs']): QualificationStats[] {
  const map: Record<string, { total: number; hours: number }> = {}
  for (const log of logs) {
    if (!log.qualification_id) continue
    if (!map[log.qualification_id]) map[log.qualification_id] = { total: 0, hours: 0 }
    map[log.qualification_id].total++
    map[log.qualification_id].hours += Number(log.hours)
  }
  return qualifications
    .map((q) => {
      const s = map[q.id] ?? { total: 0, hours: 0 }
      return {
        ...q,
        count: s.total,
        avgHours: s.total > 0 ? Math.round(s.hours / s.total) : 0,
      }
    })
    .sort((a, b) => b.count - a.count)
}

export function QualificationList({ qualifications, logs }: Props) {
  const stats = buildStats(qualifications, logs)
  const categories = ['すべて', ...Array.from(new Set(qualifications.map((q) => q.category)))]
  const [activeCategory, setActiveCategory] = useState('すべて')

  const filtered = activeCategory === 'すべて' ? stats : stats.filter((q) => q.category === activeCategory)

  return (
    <div className="space-y-4">
      {/* カテゴリフィルタ */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={activeCategory === cat ? 'default' : 'outline'}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* 資格カード一覧 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((q) => (
          <Link key={q.id} href={`/stats/${q.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm leading-tight">{q.name}</p>
                    <span className="text-xs text-muted-foreground">{q.category}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center">
                      <Users className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-bold">{q.count}</p>
                    <p className="text-xs text-muted-foreground">合格者数</p>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-bold">{q.count > 0 ? `${q.avgHours}h` : '-'}</p>
                    <p className="text-xs text-muted-foreground">平均学習時間</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">該当する資格がありません</p>
      )}
    </div>
  )
}
