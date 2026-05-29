export type Qualification = {
  id: string
  name: string
  category: string
  created_at: string
}

export type Material = {
  id: string
  title: string
  category: string
  amazon_url: string
  qualification_id: string | null
  created_at: string
}

export type StudyLog = {
  id: string
  qualification_id: string | null
  hours: number
  comment: string | null
  status: string
  bg_job: string | null
  bg_it_years: string | null
  bg_education: string | null
  created_at: string
  qualifications?: Pick<Qualification, 'name' | 'category'> | null
}
