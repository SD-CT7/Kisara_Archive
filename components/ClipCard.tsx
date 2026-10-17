import Link from 'next/link'
import Image from 'next/image'
import type { ClipMeta } from '@/lib/clips'
import styles from './ClipCard.module.css'

interface Props {
  clip: ClipMeta
  /** Shiftキーを押しながらタグを押したときに呼ばれる(複数タグ検索用) */
  onTagShiftClick?: (tag: string) => void
}

export default function ClipCard({ clip, onTagShiftClick }: Props) {
  const thumbSrc = `/clips/${clip.id}/thumb.webp`
  const rankSrc = `/ranks/${clip.final_rank}.webp`

  return (
    <Link href={`/clips/${clip.id}`} className={styles.card}>
      <div className={styles.thumb}>
        <Image
          src={thumbSrc}
          alt={`${clip.course} サムネイル`}
          width={640}
          height={360}
          className={styles.thumbImg}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.course}>{clip.course}</div>
        <div className={styles.meta}>
          <span className={styles.date}>{clip.date}</span>
          <Image
            src={rankSrc}
            alt={`${clip.final_rank}位`}
            width={28}
            height={28}
            className={styles.rankImg}
          />
        </div>
        <p className={styles.preview}>{clip.preview}…</p>
        {clip.tags.length > 0 && (
          <div className={styles.tags}>
            {clip.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?q=%23${encodeURIComponent(tag)}`}
                className={styles.tag}
                onMouseDown={(e) => {
                  // Shift+クリックでテキスト範囲選択が走るのを防ぐ
                  if (e.shiftKey && onTagShiftClick) e.preventDefault()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (e.shiftKey && onTagShiftClick) {
                    // 通常のリンク遷移(新しいウィンドウで開く)を止めて、タグを追加/削除
                    e.preventDefault()
                    onTagShiftClick(tag)
                  }
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
