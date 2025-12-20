FROM node:20-alpine

WORKDIR /app
ARG CACHE_BUST=1

# Copy only what we need to RUN (not build)
COPY dist ./dist
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server/railway-server.js"]
