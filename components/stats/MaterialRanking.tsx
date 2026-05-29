import { StudyLog, Material } from '@/types'
import { ExternalLink } from 'lucide-react'

type Props = {
  logs: StudyLog[]
  materials: Material[]
}

export function MaterialRanking({ logs, materials }: Props) {
  const counts: Record<string, number> = {}
  for (const log of logs) {
    if (log.material_id) {
      counts[log.material_id] = (counts[log.material_id] ?? 0) + 1
    }
  }

  const ranked = materials
    .map((m) => ({ ...m, count: counts[m.id] ?? 0 }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count)

  if (ranked.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-4">データがありません</p>
  }

  return (
    <ol className="space-y-2">
      {ranked.map((m, i) => (
        <li key={m.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
          <span className="text-lg font-bold text-muted-foreground w-6 text-center">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{m.title}</p>
            <p className="text-xs text-muted-foreground">{m.category} · {m.count} 人が使用</p>
          </div>
          <a
            href={m.amazon_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline whitespace-nowrap"
          >
            購入 <ExternalLink className="w-3 h-3" />
          </a>
        </li>
      ))}
    </ol>
  )
}
