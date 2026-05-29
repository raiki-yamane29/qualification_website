import { supabase } from '@/lib/supabase'
import { StudyLog, Material } from '@/types'
import { SummaryCards } from '@/components/stats/SummaryCards'
import { MaterialPieChart } from '@/components/stats/MaterialPieChart'
import { PassAvgBarChart } from '@/components/stats/PassAvgBarChart'
import { MaterialRanking } from '@/components/stats/MaterialRanking'
import { CommentTimeline } from '@/components/stats/CommentTimeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const [{ data: logsRaw }, { data: materialsRaw }] = await Promise.all([
    supabase
      .from('study_logs')
      .select('*, materials(title, amazon_url)')
      .order('created_at', { ascending: false })
      .limit(1000),
    supabase.from('materials').select('*').order('title'),
  ])

  const logs = (logsRaw ?? []) as StudyLog[]
  const materials = (materialsRaw ?? []) as Material[]
  const timeline = logs.slice(0, 20).filter((l) => l.comment)

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">学習集計ダッシュボード</h1>
          <p className="text-muted-foreground text-sm">みんなの学習データをリアルタイムで確認</p>
        </div>

        <SummaryCards logs={logs} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">教材別 人気ランキング（円グラフ）</CardTitle>
            </CardHeader>
            <CardContent>
              <MaterialPieChart logs={logs} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">合格者の平均学習時間（棒グラフ）</CardTitle>
            </CardHeader>
            <CardContent>
              <PassAvgBarChart logs={logs} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">教材リンク一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <MaterialRanking logs={logs} materials={materials} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">みんなの一言タイムライン</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentTimeline logs={timeline} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
