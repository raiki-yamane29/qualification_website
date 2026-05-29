import { StudyLog } from '@/types'

type Props = { logs: StudyLog[] }

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'たった今'
  if (minutes < 60) return `${minutes}分前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}時間前`
  const days = Math.floor(hours / 24)
  return `${days}日前`
}

export function CommentTimeline({ logs }: Props) {
  const withComment = logs.filter((l) => l.comment)

  if (withComment.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-4">コメントがありません</p>
  }

  return (
    <ul className="space-y-3">
      {withComment.map((log) => (
        <li key={log.id} className="p-3 rounded-lg border bg-card space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {log.materials?.title ?? '教材不明'} · {log.minutes}分
            </span>
            <span className="text-xs text-muted-foreground">{relativeTime(log.created_at)}</span>
          </div>
          <p className="text-sm">{log.comment}</p>
          <span
            className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
              log.status === '合格した'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {log.status}
          </span>
        </li>
      ))}
    </ul>
  )
}
