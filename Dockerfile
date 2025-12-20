FROM node:20-alpine

WORKDIR /app

# Copy manifests
COPY package.json pnpm-lock.yaml ./

# pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# Reproducible install
RUN pnpm install --frozen-lockfile

# Copy the rest
COPY . .

# Build both frontend + server
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/railway-server.js"]
