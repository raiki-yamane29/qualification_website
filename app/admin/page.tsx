import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLogin } from './AdminLogin'
import { AdminDashboard } from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'authenticated'

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  const [{ data: logsData }, { data: qualsData }] = await Promise.all([
    supabaseAdmin
      .from('study_logs')
      .select('id, hours, comment, created_at, qualifications(name)')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('qualifications')
      .select('id, name, category')
      .order('category'),
  ])

  const logs = (logsData ?? []).map((row: any) => ({
    id: row.id,
    qualification_name: row.qualifications?.name ?? null,
    hours: Number(row.hours),
    comment: row.comment,
    created_at: row.created_at,
  }))

  const qualifications = (qualsData ?? []) as { id: string; name: string; category: string }[]

  return <AdminDashboard logs={logs} qualifications={qualifications} />
}
