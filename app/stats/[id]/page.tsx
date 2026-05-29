import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { StudyLog, Material } from '@/types'
import { SummaryCards } from '@/components/stats/SummaryCards'
import { StudyTimeBarChart } from '@/components/stats/StudyTimeBarChart'
import { MaterialRanking } from '@/components/stats/MaterialRanking'
import { CommentTimeline } from '@/components/stats/CommentTimeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export default async function QualificationStatsPage({ params }: Props) {
  const { id } = await params

  const [{ data: qualification }, { data: logsRaw }, { data: materialsRaw }] = await Promise.all([
    supabase.from('qualifications').select('*').eq('id', id).single(),
    supabase
      .from('study_logs')
      .select('*')
      .eq('qualification_id', id)
      .order('created_at', { ascending: false })
      .limit(500),
    supabase.from('materials').select('*').eq('qualification_id', id),
  ])

  if (!qualification) notFound()

  const logs = (logsRaw ?? []) as StudyLog[]
  const materials = (materialsRaw ?? []) as Material[]
  const timelineLogs = logs.slice(0, 20)

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="space-y-3">
          <Link href="/stats">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              資格一覧に戻る
            </Button>
          </Link>
          <div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {qualification.category}
            </span>
            <h1 className="text-2xl font-bold mt-1">{qualification.name}</h1>
          </div>
        </div>

        {/* サマリーカード */}
        <SummaryCards logs={logs} />

        {/* 合格者の学習時間分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">合格者の学習時間分布</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyTimeBarChart logs={logs} />
          </CardContent>
        </Card>

        {/* 教材リスト */}
        {materials.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">この資格でよく使われる教材</CardTitle>
            </CardHeader>
            <CardContent>
              <MaterialRanking materials={materials} />
            </CardContent>
          </Card>
        )}

        {/* コメントタイムライン */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">みんなの一言</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentTimeline logs={timelineLogs} />
          </CardContent>
        </Card>

        {/* 投稿ボタン */}
        <div className="text-center pb-4">
          <Link href="/">
            <Button>自分の学習記録を投稿する</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
