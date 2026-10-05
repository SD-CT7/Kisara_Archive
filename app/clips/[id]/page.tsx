import fs from 'node:fs'
import path from 'node:path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAllClipIds, getClip } from '@/lib/clips'
import styles from './page.module.css'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return getAllClipIds().map((id) => ({ id }))
}

// 長いメタデータを max 文字で切って末尾に ... を付ける(改行は空白に変換)
function truncate(text: string | undefined, max: number): string {
  const flat = (text ?? '').replace(/\s+/g, ' ').trim()
  const chars = Array.from(flat) // サロゲートペアで文字化けしないように
  if (chars.length <= max) return flat
  return chars.slice(0, max).join('').trimEnd() + '...'
}

const META_TITLE_MAX = 60
const META_DESC_MAX = 75

// URLの拡張子から og:video:type 用のMIMEタイプを決める(クエリ文字列は無視)
function toVideoMime(url: string): string | undefined {
  const pathname = url.split(/[?#]/)[0].toLowerCase()
  if (pathname.endsWith('.mp4')) return 'video/mp4'
  if (pathname.endsWith('.webm')) return 'video/webm'
  return undefined
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const clip = getClip(id)
  if (!clip) return {}

  // clip.md のフロントマターに mp4: https://... がある場合だけ、
  // Discord 等で再生できる og:video を出力する(.mp4 / .webm 対応)
  // mp4 項目がなければ、video が .mp4 / .webm の直リンクのときはそれを使う
  const explicit = (clip as { mp4?: string }).mp4
  const mp4 =
    explicit ?? (toVideoMime(clip.video) ? clip.video : undefined)
  const videoType = mp4 ? toVideoMime(mp4) : undefined

  const description = truncate(clip.preview, META_DESC_MAX)

  return {
    title: truncate(`${clip.course} ${clip.date}`, META_TITLE_MAX) + ' — きさら あーかいぶ',
    description,
    openGraph: {
      title: truncate(`${clip.course} ${clip.date}`, META_TITLE_MAX),
      description,
      ...(mp4 && videoType
        ? {
            type: 'video.other' as const,
            videos: [
              {
                url: mp4,
                secureUrl: mp4,
                type: videoType,
                width: 1280,
                height: 720,
              },
            ],
          }
        : {}),
      // 動画を再生できない共有先向けのフォールバック
      images: [`/clips/${id}/thumb.webp`],
    },
  }
}

function toEmbedUrl(url: string): string {
  // YouTube通常リンク
  const watchMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
  // YouTube短縮リンク
  const shortMatch = url.match(/youtu\.be\/([\w-]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
  // それ以外はそのまま
  return url
}

export default async function ClipPage({ params }: Props) {
  const { id } = await params
  const clip = getClip(id)
  if (!clip) notFound()

  const rankSrc = `/ranks/${clip.final_rank}.webp`
  // フォルダ名 yyyy-mm-dd-s-r から先頭4要素(yyyy-mm-dd-s)を取り出し、
  // セッション単位のリザルト画像 /results/yyyy-mm-dd-s.webp を探す
  const sessionKey = id.split('-').slice(0, 4).join('-')
  const resultSrc = `/results/${sessionKey}.webp`
  const hasResult = fs.existsSync(
    path.join(process.cwd(), 'public', 'results', `${sessionKey}.webp`)
  )

  return (
    <main className={styles.root}>
      {/* 戻るボタン */}
      <div className={styles.topbar}>
        <Link href="/" className={styles.back}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          一覧に戻る
        </Link>
        <span className={styles.breadcrumb}>/ {id}</span>
      </div>

      {/* 動画プレイヤー */}
      <div className={styles.playerWrap}>
        <iframe
          src={toEmbedUrl(clip.video)}
          className={styles.player}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>

      <div className={styles.body}>
        {/* メタ情報 */}
        <div className={styles.metaCard}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>コース</span>
            <span className={styles.metaValue}>{clip.course}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>日付</span>
            <span className={styles.metaValue}>{clip.date}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>最終順位</span>
            <Image
              src={rankSrc}
              alt={`${clip.final_rank}位`}
              width={40}
              height={40}
              className={styles.rankImg}
            />
          </div>
        </div>

        {/* 解説 */}
        <div className={styles.sectionTitle}>解説</div>
        <div className={styles.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {clip.content}
          </ReactMarkdown>
        </div>

        {/* リザルト */}
        {hasResult && (
          <>
            <div className={styles.sectionTitle}>リザルト</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultSrc}
              alt="リザルト"
              className={styles.resultImg}
            />
          </>
        )}

        {/* 元動画リンク */}
        <div className={styles.sectionTitle}>元動画</div>
        <a
          href={clip.source}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkCard}
        >
          <div className={styles.linkLeft}>
            <div className={styles.linkIcon}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div>
              <div className={styles.linkText}>動画を開く</div>
              <div className={styles.linkSub}>{new URL(clip.source).hostname}</div>
            </div>
          </div>
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>

        {/* タグ */}
        {clip.tags.length > 0 && (
          <>
            <div className={styles.sectionTitle}>タグ</div>
            <div className={styles.tags}>
              {clip.tags.map((tag) => (
                <Link key={tag} href={`/?q=%23${encodeURIComponent(tag)}`} className={styles.tag}>
                  #{tag}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
