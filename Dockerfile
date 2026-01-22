# ---------- BUILD STAGE ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable \
    && corepack prepare pnpm@10.26.2 --activate \
    && pnpm install --frozen-lockfile

COPY . .

RUN for i in 1 2 3 4 5; do pnpm prisma generate && break || (echo "retry $i" && sleep 5); done
RUN pnpm build

# ---------- RUNTIME STAGE ----------
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

EXPOSE 3214
CMD ["node", "dist/server.js"]