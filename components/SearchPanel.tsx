'use client'

import { useState } from 'react'
import styles from './SearchPanel.module.css'

type Period = 'month' | 'last_month' | '3months' | 'custom' | null

export interface SearchState {
  query: string
  rankMin: string
  rankMax: string
  period: Period
  dateFrom: string
  dateTo: string
}

interface Props {
  value: SearchState
  onChange: (s: SearchState) => void
}

export const defaultSearch: SearchState = {
  query: '',
  rankMin: '',
  rankMax: '',
  period: null,
  dateFrom: '',
  dateTo: '',
}

export default function SearchPanel({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)

  function set(partial: Partial<SearchState>) {
    onChange({ ...value, ...partial })
  }

  function setPeriod(p: Period) {
    if (value.period === p) {
      set({ period: null, dateFrom: '', dateTo: '' })
    } else {
      set({ period: p, dateFrom: '', dateTo: '' })
    }
  }

  return (
    <div className={styles.wrap}>
      <button
        className={styles.btn}
        onClick={() => setOpen((o) => !o)}
        aria-label="検索"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
      </button>

      <div className={`${styles.panel} ${open ? styles.open : styles.closed}`}>
        <input
          className={styles.input}
          type="text"
          placeholder="フリーワード / #タグ / コース名..."
          value={value.query}
          onChange={(e) => set({ query: e.target.value })}
        />

        <div className={styles.label}>最終順位</div>
        <div className={styles.rankRow}>
          <input
            className={styles.rankInput}
            type="number"
            min={1}
            max={12}
            placeholder="1"
            value={value.rankMin}
            onChange={(e) => set({ rankMin: e.target.value })}
          />
          <span className={styles.tilde}>〜</span>
          <input
            className={styles.rankInput}
            type="number"
            min={1}
            max={12}
            placeholder="12"
            value={value.rankMax}
            onChange={(e) => set({ rankMax: e.target.value })}
          />
          <span className={styles.unit}>位</span>
        </div>

        <div className={styles.label}>期間</div>
        <div className={styles.periodRow}>
          {(['month', 'last_month', '3months'] as Period[]).map((p) => (
            <button
              key={p as string}
              className={`${styles.periodBtn} ${value.period === p ? styles.active : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'month' ? '今月' : p === 'last_month' ? '先月' : '3ヶ月'}
            </button>
          ))}
          <button
            className={`${styles.periodBtn} ${value.period === 'custom' ? styles.active : ''}`}
            onClick={() => setPeriod('custom')}
          >
            カスタム
          </button>
        </div>

        {value.period === 'custom' && (
          <div className={styles.customDate}>
            <input
              className={styles.input}
              type="date"
              value={value.dateFrom}
              onChange={(e) => set({ dateFrom: e.target.value })}
            />
            <span className={styles.tilde}>〜</span>
            <input
              className={styles.input}
              type="date"
              value={value.dateTo}
              onChange={(e) => set({ dateTo: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
