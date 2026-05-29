export type Material = {
  id: string
  title: string
  category: string
  amazon_url: string
  created_at: string
}

export type StudyLog = {
  id: string
  material_id: string | null
  minutes: number
  comment: string | null
  status: string
  created_at: string
  materials?: Pick<Material, 'title' | 'amazon_url'> | null
}
