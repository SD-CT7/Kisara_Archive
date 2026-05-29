# Kisara Archive

MK7 ラウンジ クリップアーカイブ

## セットアップ

```bash
npm install
npm run dev
```

## クリップの追加方法

`public/clips/` の下にフォルダを作る。フォルダ名がそのままURLになる。

```
public/clips/
  2026-04-15-2-3/       ← 日付-セッション番号-レース番号
    clip.md             ← 解説テキスト（Markdown）
    tags.txt            ← タグ（1行1タグ）
    thumb.webp          ← サムネイル（640×360推奨）
```

### clip.md のフォーマット

```markdown
---
date: 2026-04-15
session: 2
race: 3
course: マリオサーキット
final_rank: 1
video: https://drive.google.com/file/d/XXXX/preview
---

ここから解説テキスト（Markdownフル活用可）
```

**video の書き方:**
- Google Drive: `https://drive.google.com/file/d/{ファイルID}/preview`
- Dropbox: `https://www.dropbox.com/s/XXXX/video.mp4?raw=1`

### tags.txt のフォーマット

```
サンダー
通話
連携
```

## 画像ファイルの置き場所

| ファイル | 場所 |
|---|---|
| サイトロゴ | `public/logo.webp` |
| 順位アイコン（1〜12位） | `public/ranks/1.webp` 〜 `public/ranks/12.webp` |
| クリップサムネイル | `public/clips/{id}/thumb.webp` |

## コース辞書の編集

`data/courses.json` に全32コースを追加する。

```json
[
  {
    "id": "mario_circuit",
    "name": "マリオサーキット",
    "aliases": ["マリサ", "MC"]
  }
]
```

## Vercel へのデプロイ

1. GitHubにpush
2. Vercelでリポジトリを連携
3. 以降はpushするたびに自動デプロイ
