# Kuyuri Iroha Project Overview

## プロジェクト概要

Next.js 15を使用したポートフォリオウェブサイト

## 技術スタック

### フレームワーク
- **Next.js 15** - App Router と Turbopack を使用
- **TypeScript** - Strict mode 有効、パスエイリアス設定済み (`@/*` → `./src/*`)

### スタイリング
- **Tailwind CSS v4** - PostCSS と併用

### CMS
- **microCMS** - コンテンツ管理システム

### アニメーション
- **GSAP** - アニメーションライブラリ

## ディレクトリ構造

```
/src/
├── app/          # Next.js App Router のページとレイアウト
├── components/   # 再利用可能な React コンポーネント
│   ├── Header
│   ├── Footer
│   └── ProjectCard
└── lib/
    └── microcms.ts  # microCMS クライアントと API 関数
```

## 開発コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 (Turbopack使用、http://localhost:3000) |
| `npm run build` | プロダクションビルド |
| `npm start` | プロダクションサーバー起動 |
| `npm run lint` | Next.js リンティング実行 |

## 環境変数

microCMS統合に必要な環境変数：

- `NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN` - microCMSサービスドメイン
- `NEXT_PUBLIC_MICROCMS_API_KEY` - microCMS APIキー

## コンテンツタイプ

### About
プロフィール情報
- `name` - 名前
- `description` - 説明文
- `icon` - アイコン画像（オプション）

### Project
ポートフォリオアイテム
- `title` - プロジェクトタイトル
- `description` - プロジェクト説明
- `mainVisual` - メインビジュアル画像
- `date` - 日付
- `genre` - ジャンル
- `skill` - 使用スキル
- `images` - 画像一覧
- `url` - プロジェクトURL
- `github` - GitHubリポジトリURL

## 画像処理

`images.microcms-assets.io` からのリモート画像は、`next.config.ts` で Next.js Image 最適化用に設定済み。

## Git情報

- **現在のブランチ**: master
- **最近のコミット**:
  - a4c22e6: 3
  - 8588ddc: Vercelへのデプロイ時対応 2
  - a713a5d: Vercelへのデプロイ時対応
  - 4e3d875: とりあえずのWebサイト

## 開発環境

- **プラットフォーム**: Windows (win32)
- **作業ディレクトリ**: J:\workspace\kuyuri-iroha