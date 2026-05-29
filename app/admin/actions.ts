'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'

const COOKIE_NAME = 'admin_auth'
const COOKIE_VALUE = 'authenticated'

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    return { error: 'パスワードが違います' }
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8時間
    path: '/admin',
    sameSite: 'strict',
  })

  redirect('/admin')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/admin')
}

export async function deleteLogAction(id: string) {
  const cookieStore = await cookies()
  if (cookieStore.get(COOKIE_NAME)?.value !== COOKIE_VALUE) {
    return { error: '認証が必要です' }
  }

  const { error } = await supabaseAdmin.from('study_logs').delete().eq('id', id)
  if (error) return { error: '削除に失敗しました' }

  revalidatePath('/admin')
}

export async function addQualificationAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const cookieStore = await cookies()
  if (cookieStore.get(COOKIE_NAME)?.value !== COOKIE_VALUE) {
    return { error: '認証が必要です' }
  }

  const name = (formData.get('name') as string).trim()
  const category = (formData.get('category') as string).trim()

  if (!name || !category) return { error: '資格名とカテゴリは必須です' }

  const { error } = await supabaseAdmin.from('qualifications').insert({ name, category })
  if (error) return { error: '追加に失敗しました' }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}
