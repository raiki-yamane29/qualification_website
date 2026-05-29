import { supabase } from '@/lib/supabase'
import { Qualification, StudyLog } from '@/types'
import { QualificationList } from '@/components/stats/QualificationList'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const [{ data: qualificationsRaw }, { data: logsRaw }] = await Promise.all([
    supabase.from('qualifications').select('*').order('category'),
    supabase
      .from('study_logs')
      .select('qualification_id, minutes, status'),
  ])

  const qualifications = (qualificationsRaw ?? []) as Qualification[]
  const logs = (logsRaw ?? []) as Pick<StudyLog, 'qualification_id' | 'minutes' | 'status'>[]

  const totalLogs = logs.length
  const totalHours = Math.floor(logs.reduce((s, l) => s + l.minutes, 0) / 60)

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">資格別 学習統計</h1>
          <p className="text-muted-foreground text-sm">
            {totalLogs} 件の学習記録 · 合計 {totalHours} 時間
          </p>
        </div>

        <QualificationList qualifications={qualifications} logs={logs} />
      </div>
    </main>
  )
}
