import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: qualification }, { data: logs }] = await Promise.all([
    supabase.from('qualifications').select('name, category').eq('id', id).single(),
    supabase.from('study_logs').select('hours').eq('qualification_id', id),
  ])

  const count = logs?.length ?? 0
  const avgHours =
    count > 0
      ? Math.round((logs!.reduce((s, l) => s + Number(l.hours), 0) / count) * 10) / 10
      : null

  const name = qualification?.name ?? '資格'
  const category = qualification?.category ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '60px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* サイト名 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div
            style={{
              background: '#18181b',
              color: '#fff',
              fontSize: '22px',
              fontWeight: 700,
              padding: '6px 16px',
              borderRadius: '8px',
            }}
          >
            資格合格ログ
          </div>
        </div>

        {/* カテゴリ */}
        <div
          style={{
            fontSize: '24px',
            color: '#64748b',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            padding: '4px 14px',
            borderRadius: '100px',
            width: 'fit-content',
            marginBottom: '20px',
          }}
        >
          {category}
        </div>

        {/* 資格名 */}
        <div
          style={{
            fontSize: name.length > 20 ? '52px' : '64px',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.2,
            flex: 1,
          }}
        >
          {name}
        </div>

        {/* 統計 */}
        <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px 36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#10b981' }}>
              {avgHours !== null ? `${avgHours}h` : '-'}
            </div>
            <div style={{ fontSize: '20px', color: '#64748b' }}>平均学習時間</div>
          </div>
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px 36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#3b82f6' }}>{count}人</div>
            <div style={{ fontSize: '20px', color: '#64748b' }}>合格者の記録</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
