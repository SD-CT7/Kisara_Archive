import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://kisara-archive.vercel.app'),
  title: 'きさら あーかいぶ',
  description: 'MK7 ラウンジ クリップアーカイブ',
  openGraph: {
    title: 'きさら あーかいぶ',
    description: 'MK7 ラウンジ クリップアーカイブ',
    images: ['/logo.webp'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
