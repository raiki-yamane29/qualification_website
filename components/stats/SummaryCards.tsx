import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StudyLog } from '@/types'
import { Clock, Trophy } from 'lucide-react'

type Props = { logs: StudyLog[] }

export function SummaryCards({ logs }: Props) {
  const totalHours = logs.reduce((sum, l) => sum + Number(l.hours), 0)
  const avgHours = logs.length > 0 ? Math.round(totalHours / logs.length) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-base">みんなの総学習時間</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {Math.round(totalHours)}
            <span className="text-lg font-normal ml-1">時間</span>
          </p>
          <p className="text-muted-foreground text-sm mt-1">{logs.length} 件の合格記録</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <CardTitle className="text-base">合格者数</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {logs.length}
            <span className="text-lg font-normal ml-1">人</span>
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            平均 {avgHours} 時間で合格
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
