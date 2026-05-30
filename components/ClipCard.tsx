import Link from 'next/link'
import Image from 'next/image'
import type { ClipMeta } from '@/lib/clips'
import styles from './ClipCard.module.css'

interface Props {
  clip: ClipMeta
}

export default function ClipCard({ clip }: Props) {
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
                onClick={(e) => e.stopPropagation()}
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
