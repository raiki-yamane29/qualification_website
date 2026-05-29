import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StudyLog } from '@/types'
import { Clock, Trophy } from 'lucide-react'

type Props = { logs: StudyLog[] }

export function SummaryCards({ logs }: Props) {
  const totalMinutes = logs.reduce((sum, l) => sum + l.minutes, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainMinutes = totalMinutes % 60
  const passedCount = logs.filter((l) => l.status === '合格した').length
  const passRate = logs.length > 0 ? Math.round((passedCount / logs.length) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-base">みんなの総学習時間</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {totalHours}
            <span className="text-lg font-normal ml-1">時間</span>
            {remainMinutes > 0 && (
              <>
                {remainMinutes}
                <span className="text-lg font-normal ml-1">分</span>
              </>
            )}
          </p>
          <p className="text-muted-foreground text-sm mt-1">{logs.length} 件の記録</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <CardTitle className="text-base">現在の合格率</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {passRate}
            <span className="text-lg font-normal ml-1">%</span>
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            {passedCount} 人が合格
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
