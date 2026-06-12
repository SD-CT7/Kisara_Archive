import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// クリップは /public/clips/{id}/ に置く
const clipsDir = path.join(process.cwd(), 'public', 'clips')

export interface ClipMeta {
  id: string
  date: string
  session: number
  race: number
  course: string
  final_rank: number
  video: string
  tags: string[]
  preview: string
  source: string
}

export interface Clip extends ClipMeta {
  content: string
}

/** フォルダ名の逆順（新しい順）で全IDを返す */
export function getAllClipIds(): string[] {
  if (!fs.existsSync(clipsDir)) return []
  function parseId(id: string) {
  const parts = id.split('-')
  return {
    date: `${parts[0]}-${parts[1]}-${parts[2]}`,
    session: parseInt(parts[3], 10),
    race: parseInt(parts[4], 10),
  }
}

return fs.readdirSync(clipsDir)
  .filter((name) => fs.statSync(path.join(clipsDir, name)).isDirectory())
  .sort((a, b) => {
    const pa = parseId(a)
    const pb = parseId(b)
    if (pb.date !== pa.date) return pb.date.localeCompare(pa.date)
    if (pb.session !== pa.session) return pb.session - pa.session
    return pb.race - pa.race
  })
}

/** 1件のメタデータを読む */
export function getClipMeta(id: string): ClipMeta | null {
  const mdPath = path.join(clipsDir, id, 'clip.md')
  const tagsPath = path.join(clipsDir, id, 'tags.txt')

  if (!fs.existsSync(mdPath)) return null

  const raw = fs.readFileSync(mdPath, 'utf-8')
  const { data, content } = matter(raw)

  const tags = fs.existsSync(tagsPath)
    ? fs.readFileSync(tagsPath, 'utf-8')
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  // Markdownをプレーンテキストに変換して冒頭80文字を取る
  const preview = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*|__|\*|_|`/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 80)

  return {
    id,
    date: data.date instanceof Date
            ? data.date.toISOString().slice(0, 10)
               : String(data.date ?? ''),
    session: Number(data.session ?? 1),
    race: Number(data.race ?? 1),
    course: String(data.course ?? ''),
    final_rank: Number(data.final_rank ?? 0),
    video: String(data.video ?? ''),
    tags,
    preview,
    source: String(data.source ?? ''),
  }
}

/** 1件の全データ（本文含む）を読む */
export function getClip(id: string): Clip | null {
  const meta = getClipMeta(id)
  if (!meta) return null

  const mdPath = path.join(clipsDir, id, 'clip.md')
  const raw = fs.readFileSync(mdPath, 'utf-8')
  const { content } = matter(raw)

  return { ...meta, content }
}

/** 全クリップのメタデータ一覧 */
export function getAllClips(): ClipMeta[] {
  return getAllClipIds()
    .map(getClipMeta)
    .filter((c): c is ClipMeta => c !== null)
}
