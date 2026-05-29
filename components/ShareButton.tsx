'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

type Props = {
  materialTitle: string
  minutes: number
  siteUrl?: string
}

export function ShareButton({ materialTitle, minutes, siteUrl = '' }: Props) {
  function handleShare() {
    const text = `#勉強垢 「${materialTitle}」で${minutes}分勉強しました！`
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
