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

- Docker Desktop がインストールされ、起動していること
- Windows の場合は WSL 2 と Docker Desktop の WSL 連携が有効になっていること

以下の手順では、Composer を PHP が同梱された Docker コンテナ内で実行します。ホスト側に PHP や Composer をインストールする必要はありません。

### Windows（PowerShell + WSL 2）

#### 1. クローンと環境設定

PowerShell を開き、作業したい場所で実行します。

```powershell
git clone git@github.com:YasuakiHirano/prano.git
Set-Location prano
Copy-Item .env.example .env
```

すでにクローン済みの場合は、`Set-Location` でリポジトリのフォルダに移動してください。

#### 2. Composer パッケージのインストール

必ずリポジトリのフォルダで実行します。

```powershell
docker run --rm -v "${PWD}:/app" -w /app composer:2 install
```

#### 3. WSL から Sail を起動

WSL を開き、Windows のリポジトリへ移動します。
`hoge` は Windows のユーザー名に読み替えてください。

```bash
cd /mnt/c/Users/hoge/prano
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```

`./vendor/bin/sail` は WSL のターミナルで実行してください。PowerShell では実行できません。Git Bash を使う場合も、先に `cd /c/Users/hoge/prano` でリポジトリに移動してください。Composer の Docker コマンドは PowerShell で実行します。

### macOS

#### 1. クローンと環境設定

ターミナルで実行します。

```bash
git clone git@github.com:YasuakiHirano/prano.git
cd prano
cp .env.example .env
```

すでにクローン済みの場合は、`cd` でリポジトリのフォルダに移動してください。

#### 2. Composer パッケージのインストール

```bash
docker run --rm -v "$PWD:/app" -w /app composer:2 install
```

#### 3. Sail とフロントエンド開発サーバーを起動

```bash
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```

### アプリケーションへのアクセス

開発サーバーを起動した状態でブラウザからアクセスします。

- Web アプリケーション: [http://localhost](http://localhost)
- ログイン画面: [http://localhost/login](http://localhost/login)
- ユーザー登録画面: [http://localhost/register](http://localhost/register)

MySQL のホスト側ポートは既定で `3309` です。変更する場合は `.env` の `FORWARD_DB_PORT` を設定してください。

### 停止・再起動

リポジトリのフォルダで実行します（Windows は WSL）。

```bash
./vendor/bin/sail stop
./vendor/bin/sail up -d
```

### テスト

```bash
./vendor/bin/sail artisan test
```

---

## 📄 ライセンス
[MIT License](LICENSE)
