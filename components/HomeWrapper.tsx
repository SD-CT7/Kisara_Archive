import { Suspense } from 'react'
import { getAllClips } from '@/lib/clips'
import { courses } from '@/lib/courses'
import HomeWrapper from '@/components/HomeWrapper'

export default function HomePage() {
  const clips = getAllClips()
  return (
    <main>
      <Suspense>
        <HomeWrapper clips={clips} courses={courses} />
      </Suspense>
    </main>
  )
}
