import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'きさら あーかいぶ',
  description: 'Kisara MK7 ラウンジ クリップアーカイブ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
