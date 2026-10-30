# Prano（プラノ）

OSSの少人数チーム向けシンプル＆軽量タスク管理ツール

---

## 🛠 技術スタック

- **バックエンド**: PHP 8.5 / Laravel (最新安定版)
- **フロントエンド**: React 18 / TypeScript / Inertia.js
- **ビルドツール**: Vite
- **UI・スタイリング**: Tailwind CSS
- **開発環境**: Laravel Sail (Docker / MySQL 8.4)

---

## 🚀 開発環境の起動方法

### 前提条件
- Docker Desktop が起動していること

### 1. リポジトリのクローン & 環境設定
```bash
git clone git@github.com:YasuakiHirano/pirano.git
cd pirano
cp .env.example .env
```

### 2. コンテナの起動
Laravel Sail を使用して Docker コンテナをバックグラウンドで起動します。
```bash
./vendor/bin/sail up -d
```

> **Note**: ホストマシンで `3306` 番ポートが別コンテナ等で使用されている場合を考慮し、デフォルトの MySQL ホストフォワードポートを `3309` に設定しています（`.env` の `FORWARD_DB_PORT` で変更可能）。

### 3. マイグレーション
```bash
./vendor/bin/sail artisan migrate
```

### 4. フロントエンド開発サーバーの起動
```bash
# パッケージインストール（必要な場合）
./vendor/bin/sail npm install

# 開発サーバー起動 (HMR)
./vendor/bin/sail npm run dev

# または本番ビルド
./vendor/bin/sail npm run build
```

### 5. アプリケーションへのアクセス
ブラウザで以下にアクセスします：
- **Web アプリケーション**: [http://localhost](http://localhost)
  - ログイン画面: [http://localhost/login](http://localhost/login)
  - ユーザー登録画面: [http://localhost/register](http://localhost/register)

### 6. テストの実行
```bash
./vendor/bin/sail artisan test
```

---

## 📄 ライセンス
[MIT License](LICENSE)
