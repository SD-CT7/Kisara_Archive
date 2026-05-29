import coursesData from '@/data/courses.json'

export interface Course {
  id: string
  name: string
  aliases: string[]
}

export const courses: Course[] = coursesData

/** コース名または略称からCourseを引く */
export function findCourse(query: string): Course | undefined {
  const q = query.toLowerCase()
  return courses.find(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.aliases.some((a) => a.toLowerCase().includes(q))
  )
}

/** あるコース名に対応するすべての表記（正式名 + 略称）を返す */
export function getCourseNames(courseName: string): string[] {
  const course = courses.find((c) => c.name === courseName)
  if (!course) return [courseName]
  return [course.name, ...course.aliases]
}
