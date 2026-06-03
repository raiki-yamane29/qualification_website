'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

type Props = {
  qualificationName: string
  hours: number
  siteUrl?: string
}

export function ShareButton({ qualificationName, hours, siteUrl = '' }: Props) {
  function handleShare() {
    const text = `「${qualificationName}」に合格しました！ 勉強時間は${hours}時間でした #${qualificationName}`
    const url = new URL('https://twitter.com/intent/tweet')
    url.searchParams.set('text', text)
    if (siteUrl) url.searchParams.set('url', siteUrl)
    window.open(url.toString(), '_blank', 'noopener,noreferrer')
  }

  return (
    <Button onClick={handleShare} className="gap-2 bg-black hover:bg-zinc-800 text-white">
      <Share2 className="w-4 h-4" />
      X でシェアする
    </Button>
  )
}
