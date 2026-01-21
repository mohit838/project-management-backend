# Necessary packages

```bash
pnpm add express cors cookie-parser helmet morgan dotenv
pnpm add zod jsonwebtoken bcrypt
pnpm add -D typescript @types/node @types/express @types/cookie-parser @types/cors @types/jsonwebtoken @types/bcrypt
pnpm add -D tsup tsx eslint prettier vitest supertest @types/supertest
```

## Project tree

- `Linux / macOS`

```bash
  tree -I "node_modules|dist|.git|.vscode|logs|tmp|coverage|vendor|generated" > project-tree.txt
```

## Generate keys

- `openssl rand -hex 32`
- `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Docker Composer

```bash
  sudo docker compose build --no-cache
  sudo docker compose up -d --build
  docker compose up
  docker compose down -v
  docker compose up -d --build --no-deps project_mgmt
  docker logs project_mgmt
```
