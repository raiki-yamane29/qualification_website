'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function CompletePage() {
  const router = useRouter()
  const [materialTitle, setMaterialTitle] = useState('')
  const [minutes, setMinutes] = useState(0)

  useEffect(() => {
    if (localStorage.getItem('submitted') !== 'true') {
      router.replace('/')
      return
    }
    setMaterialTitle(localStorage.getItem('lastMaterialTitle') ?? '')
    setMinutes(Number(localStorage.getItem('lastMinutes') ?? '0'))
  }, [router])

  function handlePostAgain() {
    localStorage.removeItem('submitted')
    localStorage.removeItem('lastMaterialTitle')
    localStorage.removeItem('lastMinutes')
    router.push('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-10 pb-8 space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">お疲れ様でした！</h1>
            <p className="text-muted-foreground text-sm">
              学習記録を投稿しました。引き続き頑張りましょう！
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            {materialTitle && minutes > 0 && (
              <ShareButton materialTitle={materialTitle} minutes={minutes} />
            )}
            <Button variant="outline" onClick={handlePostAgain}>
              もう一度投稿する
            </Button>
            <Button variant="ghost" onClick={() => router.push('/stats')}>
              集計を見る →
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
