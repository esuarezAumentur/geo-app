# geo-app monorepo

Monorepo de la Plataforma de Mapas Interactivos 3D, con backend y frontend en un solo workspace.

## Estructura

```text
apps/
  backend/      # API Express + MongoDB
  frontend/     # SPA/PWA Vue + Vite + Cesium
infra/
  docker/       # Docker Compose, nginx y Dockerfile de API
packages/       # Reservado para paquetes compartidos
```

## Requisitos

- Node.js >= 20.19.0
- pnpm
- Docker y Docker Compose

## Primer arranque

```bash
pnpm install
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

## Desarrollo

```bash
# Backend + frontend en paralelo
pnpm dev

# Solo backend
pnpm dev:backend

# Solo frontend
pnpm dev:frontend
```

## Build / lint / test

```bash
pnpm build
pnpm lint
pnpm test
```

## Docker (API + Mongo + nginx)

```bash
pnpm docker:up
pnpm docker:down
```

## Nota de alcance

La configuración CI/CD del monorepo se mantiene como fase futura.
