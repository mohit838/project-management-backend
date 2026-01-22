# ---------- BUILD STAGE ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.26.2 --activate
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

# Tricks
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"

# Now generate client
RUN pnpm prisma generate

# Copy the rest and build
COPY . .
RUN pnpm build


# ---------- RUNTIME STAGE ----------
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3214
CMD ["node", "dist/server.js"]
