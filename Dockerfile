# ベースイメージを指定（Node.jsのバージョンを指定）
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# 残りのアプリケーションコードをコピー
COPY . .

# ポートを指定（Next.js のデフォルトポートは3000）
EXPOSE 3000

# 開発モードでアプリケーションを起動
CMD ["npm", "run", "dev"]
