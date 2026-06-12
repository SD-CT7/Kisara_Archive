'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ClipCard from './ClipCard'
import SearchPanel, { defaultSearch, type SearchState } from './SearchPanel'
import type { ClipMeta } from '@/lib/clips'
import type { Course } from '@/lib/courses'
import styles from './HomeClient.module.css'

interface Props {
  clips: ClipMeta[]
  courses: Course[]
}

function idToDate(id: string): string {
  return id.slice(0, 10)
}

function getPeriodRange(period: SearchState['period']): { from: string; to: string } | null {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  if (period === 'month') {
    const from = new Date(y, m, 1)
    const to = new Date(y, m + 1, 0)
    return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }
  }
  if (period === 'last_month') {
    const from = new Date(y, m - 1, 1)
    const to = new Date(y, m, 0)
    return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }
  }
  if (period === '3months') {
    const from = new Date(y, m - 2, 1)
    const to = new Date(y, m + 1, 0)
    return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }
  }
  return null
}

function getCourseNames(courseName: string, courses: Course[]): string[] {
  const c = courses.find((c) => c.name === courseName)
  return c ? [c.name, ...c.aliases] : [courseName]
}

function parseQuery(query: string) {
  const tokens = query.trim().split(/\s+/).filter(Boolean)
  const tags: string[] = []
  const texts: string[] = []
  for (const t of tokens) {
    if (t.startsWith('#')) tags.push(t.slice(1))
    else texts.push(t)
  }
  return { tags, texts }
}

function filterClips(clips: ClipMeta[], search: SearchState, courses: Course[]): ClipMeta[] {
  const { tags, texts } = parseQuery(search.query)
  let dateFrom = search.dateFrom
  let dateTo = search.dateTo
  if (search.period && search.period !== 'custom') {
    const range = getPeriodRange(search.period)
    if (range) { dateFrom = range.from; dateTo = range.to }
  }
  return clips.filter((clip) => {
    if (tags.length > 0) {
      const clipTagsLower = clip.tags.map((t) => t.toLowerCase())
      if (!tags.every((t) => clipTagsLower.includes(t.toLowerCase()))) return false
    }
    if (texts.length > 0) {
      const allCourseNames = getCourseNames(clip.course, courses)
      for (const text of texts) {
        const tl = text.toLowerCase()
        const matchesCourse = allCourseNames.some((n) => n.toLowerCase().includes(tl))
        const matchesPreview = clip.preview.toLowerCase().includes(tl)
        if (!matchesCourse && !matchesPreview) return false
      }
    }
    if (search.rankMin !== '') {
      if (clip.final_rank < Number(search.rankMin)) return false
    }
    if (search.rankMax !== '') {
      if (clip.final_rank > Number(search.rankMax)) return false
    }
    const clipDate = idToDate(clip.id)
    if (dateFrom && clipDate < dateFrom) return false
    if (dateTo && clipDate > dateTo) return false
    return true
  })
}

export default function HomeClient({ clips, courses }: Props) {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState<SearchState>({
    ...defaultSearch,
    query: searchParams.get('q') ?? '',
  })

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setSearch((prev) => ({ ...prev, query: q }))
  }, [searchParams])

  const filtered = useMemo(
    () => filterClips(clips, search, courses),
    [clips, courses, search]
  )

  return (
    <>
      <div className={styles.searchFixed}>
        <SearchPanel value={search} onChange={setSearch} />
      </div>
      <div className={styles.header}>
<Image
  src="/logo.webp"
  alt="Kisara Archive ロゴ"
  width={48}
  height={48}
  className={styles.logo}
  onClick={() => setSearch(defaultSearch)}
  style={{ cursor: 'pointer' }}
/>
        <h1 className={styles.title}>きさら あーかいぶ</h1>
      </div>
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>該当するクリップが見つかりませんでした。</p>
      )}
    </>
  )
}
