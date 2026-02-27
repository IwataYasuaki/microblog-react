# microblog

TypeScript + React + AWS サーバーレスで構築するマイクロブログサービス。

## 技術スタック

- **フロントエンド**: React + Vite + TypeScript
- **バックエンド**: AWS Lambda（TypeScript）
- **API**: API Gateway
- **DB**: DynamoDB
- **認証**: Amazon Cognito
- **ホスティング**: S3 + CloudFront
- **IaC**: AWS CDK（TypeScript）

## 開発環境のセットアップ

### 必要なもの

- [Mise](https://mise.jdx.dev/)

### セットアップ手順
```bash
# ツールのインストール
mise install

# 依存パッケージのインストール
pnpm install

# フロントエンド開発サーバーの起動
pnpm dev
```

## テスト
```bash
# フロントエンドのテスト
pnpm test

# インフラのテスト
pnpm test:infra
```
