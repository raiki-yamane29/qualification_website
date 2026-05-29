'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const FILTERS = [
  {
    key: 'job',
    label: '職種',
    options: ['学生', 'ITエンジニア', '非IT職', 'その他'],
  },
  {
    key: 'it_years',
    label: 'IT経験',
    options: ['未経験', '〜1年', '1〜3年', '3〜5年', '5年以上'],
  },
  {
    key: 'education',
    label: '学歴',
    options: ['高専・専門卒', '大卒（文系）', '大卒（理系）', '大学院卒', 'その他'],
  },
]

type Props = { totalCount: number; filteredCount: number }

export function BackgroundFilter({ totalCount, filteredCount }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function toggle(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    router.push(pathname)
  }

  const hasFilter = FILTERS.some((f) => searchParams.get(f.key))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {hasFilter
            ? `${totalCount}件中 ${filteredCount}件を表示`
            : `${totalCount}件の合格記録`}
        </p>
        {hasFilter && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            絞り込みを解除
          </button>
        )}
      </div>
      {FILTERS.map((f) => (
        <div key={f.key}>
          <p className="text-xs text-muted-foreground mb-1.5">{f.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {f.options.map((opt) => {
              const active = searchParams.get(f.key) === opt
              return (
                <button
                  key={opt}
                  onClick={() => toggle(f.key, opt)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? 'bg-zinc-800 text-white border-zinc-800'
                      : 'bg-muted text-muted-foreground border-transparent hover:border-zinc-300'
                  }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
