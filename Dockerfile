FROM node:20-alpine

WORKDIR /app

# Copy package manager + manifests first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install deps
RUN pnpm install --frozen-lockfile=false

# Copy the rest of the repo
COPY . .

# Build (frontend + server, whatever your pnpm build does)
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/index.js"]
