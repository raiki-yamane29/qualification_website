import { StudyLogForm } from '@/components/StudyLogForm'

export default function HomePage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">資格勉強ログ</h1>
          <p className="text-muted-foreground text-sm">
            今日の学習を10秒で記録しよう
          </p>
        </div>
        <StudyLogForm />
      </div>
    </main>
  )
}
