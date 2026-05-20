FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/
RUN npm install -g pnpm@9 && pnpm install --frozen-lockfile

FROM base AS builder
RUN apk add --no-cache libc6-compat python3 make g++
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @sobatwarung/backend build

FROM base AS runner
RUN apk add --no-cache dumb-init
ENV NODE_ENV=production

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

RUN pnpm --filter @sobatwarung/backend deploy:prod

EXPOSE 3000
ENV PORT=3000

USER node
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
