import { Suspense } from 'react'
import { getAllClips } from '@/lib/clips'
import { courses } from '@/lib/courses'
import HomeClient from '@/components/HomeClient'

export default function HomePage() {
  const clips = getAllClips()
  return (
    <main>
      <Suspense>
        <HomeClient clips={clips} courses={courses} />
      </Suspense>
    </main>
  )
}
