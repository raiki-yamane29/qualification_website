'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Qualification } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const SLIDER_MIN = 0
const SLIDER_MAX = 500

const BG_JOB_OPTIONS = ['学生', 'ITエンジニア', '非IT職', 'その他']
const BG_IT_YEARS_OPTIONS = ['未経験', '〜1年', '1〜3年', '3〜5年', '5年以上']
const BG_EDUCATION_OPTIONS = ['高専・専門卒', '大卒（文系）', '大卒（理系）', '大学院卒', 'その他']

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(value === opt ? '' : opt)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              value === opt
                ? 'bg-zinc-800 text-white border-zinc-800'
                : 'bg-muted text-muted-foreground border-transparent hover:border-zinc-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function StudyLogForm() {
  const router = useRouter()
  const [qualifications, setQualifications] = useState<Qualification[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [qualificationId, setQualificationId] = useState<string>('')
  const [qualificationName, setQualificationName] = useState<string>('')
  const [hours, setHours] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [bgJob, setBgJob] = useState('')
  const [bgItYears, setBgItYears] = useState('')
  const [bgEducation, setBgEducation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('submitted') === 'true') {
      router.replace('/complete')
    }
  }, [router])

  useEffect(() => {
    supabase
      .from('qualifications')
      .select('*')
      .order('category')
      .then(({ data }) => {
        if (data) {
          const list = data as Qualification[]
          setQualifications(list)
          setSelectedCategory(list[0]?.category ?? '')
        }
      })
  }, [])

  const categories = Array.from(new Set(qualifications.map((q) => q.category)))
  const filteredQualifications = qualifications.filter((q) => q.category === selectedCategory)

  function selectQualification(q: Qualification) {
    setQualificationId(q.id)
    setQualificationName(q.name)
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!qualificationId) {
      setError('資格を選択してください。')
      return
    }
    setSubmitting(true)
    setError('')

    const { error: insertError } = await supabase.from('study_logs').insert({
      qualification_id: qualificationId,
      minutes: Math.round(hours * 60),
      comment: comment.trim() || null,
      status: '合格した',
      bg_job: bgJob || null,
      bg_it_years: bgItYears || null,
      bg_education: bgEducation || null,
    })

    if (insertError) {
      setError('送信に失敗しました。もう一度お試しください。')
      setSubmitting(false)
      return
    }

    localStorage.setItem('submitted', 'true')
    localStorage.setItem('lastQualificationName', qualificationName)
    localStorage.setItem('lastQualificationId', qualificationId)
    localStorage.setItem('lastHours', String(hours))
    router.push('/complete')
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">合格体験を投稿する</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── 資格選択 ── */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">受験した資格</Label>

            <div>
              <p className="text-xs text-muted-foreground mb-1.5">カテゴリ</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat)
                      setQualificationId('')
                      setQualificationName('')
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-zinc-800 text-white border-zinc-800'
                        : 'bg-muted text-muted-foreground border-transparent hover:border-zinc-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {selectedCategory && (
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">資格を選択</p>
                <div className="grid grid-cols-1 gap-2">
                  {filteredQualifications.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => selectQualification(q)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border transition-colors text-sm ${
                        qualificationId === q.id
                          ? 'bg-primary/10 border-primary text-primary font-medium'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                    >
                      {q.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── 勉強時間（スライダー） ── */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">合計勉強時間</Label>
            <div className="text-center">
              <span className="text-4xl font-bold tabular-nums">{hours}</span>
              <span className="text-lg text-muted-foreground ml-1">時間</span>
            </div>
            <input
              type="range"
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-0.5">
              <span>{SLIDER_MIN}時間</span>
              <span>100時間</span>
              <span>200時間</span>
              <span>300時間</span>
              <span>{SLIDER_MAX}時間</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0">直接入力:</span>
              <input
                type="number"
                min={SLIDER_MIN}
                max={9999}
                step={5}
                value={hours}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (!isNaN(v) && v >= 0) setHours(v)
                }}
                className="w-24 border rounded-md px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground">時間</span>
            </div>
          </div>

          {/* ── 背景情報（任意） ── */}
          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">あなたの背景</Label>
              <span className="text-xs text-muted-foreground ml-2">任意</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              入力すると、同じ背景を持つ人が参考にしやすくなります
            </p>
            <ChipGroup label="職種" options={BG_JOB_OPTIONS} value={bgJob} onChange={setBgJob} />
            {bgJob === 'ITエンジニア' && (
              <ChipGroup
                label="ITエンジニア歴"
                options={BG_IT_YEARS_OPTIONS}
                value={bgItYears}
                onChange={setBgItYears}
              />
            )}
            <ChipGroup
              label="学歴"
              options={BG_EDUCATION_OPTIONS}
              value={bgEducation}
              onChange={setBgEducation}
            />
          </div>

          {/* ── コメント ── */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">一言コメント（任意）</Label>
            <Textarea
              id="comment"
              placeholder="勉強方法や感想など..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? '送信中...' : '投稿する'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
