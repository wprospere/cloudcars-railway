FROM node:20-alpine

WORKDIR /app

# Copy package.json only (no lockfile)
COPY package.json ./

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# Install dependencies
RUN pnpm install

# Copy the rest of the repo
COPY . .

# Build frontend + server
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/server/railway-server.js"]

