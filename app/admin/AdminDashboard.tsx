'use client'

import { useTransition, useActionState } from 'react'
import { deleteLogAction, logoutAction, addQualificationAction } from './actions'
import { Button } from '@/components/ui/button'

type Log = {
  id: string
  qualification_name: string | null
  minutes: number
  comment: string | null
  created_at: string
}

type Qualification = {
  id: string
  name: string
  category: string
}

type Props = { logs: Log[]; qualifications: Qualification[] }

function formatHours(minutes: number): string {
  const h = minutes / 60
  return h % 1 === 0 ? `${h}時間` : `${h.toFixed(1)}時間`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('この投稿を削除しますか？')) return
    startTransition(() => {
      deleteLogAction(id)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-xs text-destructive hover:underline disabled:opacity-50"
    >
      {pending ? '削除中...' : '削除'}
    </button>
  )
}

function AddQualificationForm({ existingCategories }: { existingCategories: string[] }) {
  const [state, formAction, pending] = useActionState(addQualificationAction, null)

  return (
    <form action={formAction} className="flex flex-wrap gap-2 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">資格名</label>
        <input
          name="name"
          required
          placeholder="例: G検定"
          className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-48"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">カテゴリ</label>
        <input
          name="category"
          required
          placeholder={existingCategories[0] ?? '例: AI・データ'}
          list="category-list"
          className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-40"
        />
        <datalist id="category-list">
          {existingCategories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? '追加中...' : '追加'}
      </Button>
      {state?.error && <p className="text-sm text-destructive w-full">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-600 w-full">追加しました</p>}
    </form>
  )
}

export function AdminDashboard({ logs, qualifications }: Props) {
  const categories = Array.from(new Set(qualifications.map((q) => q.category)))

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">管理画面</h1>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm">ログアウト</Button>
        </form>
      </div>

      {/* 資格管理 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">資格一覧 ({qualifications.length}件)</h2>
        <AddQualificationForm existingCategories={categories} />
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-2 font-medium">カテゴリ</th>
                <th className="text-left px-4 py-2 font-medium">資格名</th>
              </tr>
            </thead>
            <tbody>
              {qualifications.map((q, i) => (
                <tr key={q.id} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                  <td className="px-4 py-2 text-muted-foreground">{q.category}</td>
                  <td className="px-4 py-2">{q.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 投稿管理 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">投稿一覧 ({logs.length}件)</h2>
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-sm">投稿がありません</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">日付</th>
                  <th className="text-left px-4 py-2 font-medium">資格</th>
                  <th className="text-left px-4 py-2 font-medium">時間</th>
                  <th className="text-left px-4 py-2 font-medium">コメント</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                    <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-2">{log.qualification_name ?? '—'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatHours(log.minutes)}</td>
                    <td className="px-4 py-2 max-w-xs truncate text-muted-foreground">
                      {log.comment ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <DeleteButton id={log.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
