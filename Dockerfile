FROM node:20-alpine

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# Copy dependency manifests FIRST for better Docker layer caching
COPY package.json ./
COPY pnpm-lock.yaml ./ 

# Install dependencies (deterministic)
RUN pnpm install --frozen-lockfile

# Copy the rest of the repo
COPY . .

# Build frontend + server
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/server/railway-server.js"]
