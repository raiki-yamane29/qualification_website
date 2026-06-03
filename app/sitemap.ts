import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://qualification-website.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: qualifications } = await supabase
    .from('qualifications')
    .select('id, created_at')

  const qualificationUrls = (qualifications ?? []).map((q) => ({
    url: `${BASE_URL}/stats/${q.id}`,
    lastModified: new Date(q.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/stats`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...qualificationUrls,
  ]
}
