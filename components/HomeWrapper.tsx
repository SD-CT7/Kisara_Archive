'use client'

import { useSearchParams } from 'next/navigation'
import HomeClient from './HomeClient'
import type { ClipMeta } from '@/lib/clips'
import type { Course } from '@/lib/courses'

interface Props {
  clips: ClipMeta[]
  courses: Course[]
}

export default function HomeWrapper({ clips, courses }: Props) {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  return <HomeClient clips={clips} courses={courses} initialQuery={initialQuery} />
}
