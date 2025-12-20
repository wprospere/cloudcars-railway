FROM node:20-alpine
WORKDIR /app

# Copy manifests
COPY package.json pnpm-lock.yaml* ./

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install prod deps (or all deps if needed)
RUN pnpm install --prod

# Copy built output
COPY dist ./dist

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/index.js"]
