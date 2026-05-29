'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Material } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const QUICK_MINUTES = [30, 60, 90, 120, 150, 180]

export function StudyLogForm() {
  const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>([])
  const [materialId, setMaterialId] = useState<string>('')
  const [minutes, setMinutes] = useState<number | ''>('')
  const [status, setStatus] = useState<'勉強中' | '合格した'>('勉強中')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('submitted') === 'true') {
      router.replace('/complete')
    }
  }, [router])

  useEffect(() => {
    supabase
      .from('materials')
      .select('*')
      .order('title')
      .then(({ data }) => {
        if (data) setMaterials(data as Material[])
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!materialId || !minutes) {
      setError('教材と勉強時間を入力してください。')
      return
    }
    setSubmitting(true)
    setError('')

    const selectedMaterial = materials.find((m) => m.id === materialId)

    const { error: insertError } = await supabase.from('study_logs').insert({
      material_id: materialId,
      minutes: Number(minutes),
      comment: comment.trim() || null,
      status,
    })

    if (insertError) {
      setError('送信に失敗しました。もう一度お試しください。')
      setSubmitting(false)
      return
    }

    localStorage.setItem('submitted', 'true')
    localStorage.setItem('lastMaterialTitle', selectedMaterial?.title ?? '')
    localStorage.setItem('lastMinutes', String(minutes))
    router.push('/complete')
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">学習記録を投稿する</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 教材選択 */}
          <div className="space-y-2">
            <Label htmlFor="material">教材</Label>
            <Select value={materialId} onValueChange={(v) => setMaterialId(v ?? '')}>
              <SelectTrigger id="material">
                <SelectValue placeholder="教材を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 勉強時間 */}
          <div className="space-y-2">
            <Label>勉強時間（分）</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_MINUTES.map((m) => (
                <Button
                  key={m}
                  type="button"
                  variant={minutes === m ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMinutes(m)}
                >
                  {m}分
                </Button>
              ))}
            </div>
            <input
              type="number"
              min={1}
              max={1440}
              placeholder="または直接入力（分）"
              value={minutes}
              onChange={(e) =>
                setMinutes(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* 現在の状態 */}
          <div className="space-y-2">
            <Label>現在の状態</Label>
            <RadioGroup
              value={status}
              onValueChange={(v) => setStatus(v as typeof status)}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="勉強中" id="studying" />
                <Label htmlFor="studying">勉強中</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="合格した" id="passed" />
                <Label htmlFor="passed">合格した</Label>
              </div>
            </RadioGroup>
          </div>

          {/* コメント */}
          <div className="space-y-2">
            <Label htmlFor="comment">一言コメント（任意）</Label>
            <Textarea
              id="comment"
              placeholder="学習の感想や進捗など..."
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
