import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '資格合格ログ',
  description: '誰でも資格試験の学習記録を投稿・集計できるサイト',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg">
              資格合格ログ
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="hover:underline">
                投稿する
              </Link>
              <Link href="/stats" className="hover:underline">
                集計を見る
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}
