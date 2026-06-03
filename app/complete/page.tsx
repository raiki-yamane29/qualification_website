'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function CompletePage() {
  const router = useRouter()
  const [qualificationName, setQualificationName] = useState('')
  const [qualificationId, setQualificationId] = useState('')
  const [hours, setHours] = useState(0)

  useEffect(() => {
    if (localStorage.getItem('submitted') !== 'true') {
      router.replace('/')
      return
    }
    setQualificationName(localStorage.getItem('lastQualificationName') ?? '')
    setQualificationId(localStorage.getItem('lastQualificationId') ?? '')
    setHours(Number(localStorage.getItem('lastHours') ?? '0'))
  }, [router])

  function handlePostAgain() {
    localStorage.removeItem('submitted')
    localStorage.removeItem('lastQualificationName')
    localStorage.removeItem('lastQualificationId')
    localStorage.removeItem('lastHours')
    router.push('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-10 pb-8 space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">投稿ありがとうございます！</h1>
            {qualificationName && hours > 0 && (
              <p className="text-muted-foreground text-sm">
                「{qualificationName}」を {hours} 時間で合格した記録を登録しました
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 items-center">
            {qualificationName && hours > 0 && (
              <ShareButton
                qualificationName={qualificationName}
                hours={hours}
                siteUrl={
                  qualificationId
                    ? `https://qualification-website.vercel.app/stats/${qualificationId}`
                    : 'https://qualification-website.vercel.app'
                }
              />
            )}
            <Button variant="outline" onClick={handlePostAgain}>
              もう一度投稿する
            </Button>
            {qualificationId ? (
              <Button variant="ghost" onClick={() => router.push(`/stats/${qualificationId}`)}>
                この資格の統計を見る →
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => router.push('/stats')}>
                統計を見る →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
