# 資格勉強ログ

資格試験の合格体験を投稿・共有できる Web アプリ。  
ユーザー登録不要で、何時間勉強して合格したかを記録し、資格ごとの統計データをリアルタイムで確認できます。

## 機能

- **合格体験の投稿** — 資格・合計勉強時間・コメントを 10 秒で記録
- **資格別統計** — 合格者数・平均学習時間・学習時間分布をグラフで表示
- **X（Twitter）シェア** — 合格を SNS でシェア
- **多重投稿防止** — LocalStorage による投稿済みフラグ管理

## 技術スタック

| 分類 | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| スタイリング | Tailwind CSS v4 |
| UI コンポーネント | shadcn/ui |
| データベース | Supabase (PostgreSQL) |
| グラフ | Recharts |
| ホスティング | Vercel |

## 画面構成

| パス | 説明 |
|---|---|
| `/` | 合格体験の投稿フォーム |
| `/complete` | 投稿完了・SNS シェア画面 |
| `/stats` | 資格一覧（合格者数・平均学習時間） |
| `/stats/[id]` | 資格別詳細統計 |

## ローカル開発

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、Supabase の URL と ANON KEY を設定します。

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 3. Supabase のセットアップ

Supabase ダッシュボードの SQL Editor で以下を実行してください。

```sql
-- 資格マスター
create table qualifications (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  created_at timestamp default timezone('utc'::text, now()) not null
);

-- 教材マスター
create table materials (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  amazon_url text not null,
  qualification_id uuid references qualifications(id) on delete set null,
  created_at timestamp default timezone('utc'::text, now()) not null
);

-- 学習記録
create table study_logs (
  id uuid default gen_random_uuid() primary key,
  qualification_id uuid references qualifications(id) on delete set null,
  minutes integer not null,
  comment text,
  status text not null,
  created_at timestamp default timezone('utc'::text, now()) not null
);

-- RLS（anon ユーザーに SELECT / INSERT のみ許可）
alter table qualifications enable row level security;
alter table materials enable row level security;
alter table study_logs enable row level security;

create policy "anon select qualifications" on qualifications for select to anon using (true);
create policy "anon select materials" on materials for select to anon using (true);
create policy "anon select study_logs" on study_logs for select to anon using (true);
create policy "anon insert study_logs" on study_logs for insert to anon with check (true);
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開きます。

## デプロイ

Vercel にデプロイする場合、プロジェクト設定の **Environment Variables** に `.env.local` と同じキーを登録してください。

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
