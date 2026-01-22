# ---------- BUILD STAGE ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma generate
RUN pnpm build

# ---------- RUNTIME STAGE ----------
FROM node:22-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist

EXPOSE 3214
CMD ["node", "dist/server.js"]
