# zeelove (زیلاو)

Production-grade Persian (Farsi, RTL) e-commerce platform with a "god mode" editorial CMS admin panel.

## Architecture & Principles

- **Modular Monolith (Domain-Driven Design)**: Strict separation of concerns (`domain`, `application`, `infrastructure`, `presentation`).
- **Dependency Inversion**: Enforced via `dependency-cruiser` (presentation -> application -> domain, infra -> application/domain).
- **Self-Hosted & Zero Cloud Lock-in**: PostgreSQL, Redis, and Caddy reverse proxy running on Docker.
- **RTL-First**: Farsi UI with logical Tailwind utilities and Persian typography.

## Quick Start (Local Development)

### Prerequisites

- Node.js LTS (v20+ or v22+)
- `pnpm` (v9+)
- Docker & Docker Compose

### 1. Setup Environment

```bash
cp .env.example .env
pnpm install
```

### 2. Run with Docker (Development Mode)

```bash
# Starts Postgres, Redis, and Next.js dev server with hot reload
make docker-dev
# or: docker compose -f docker-compose.dev.yml up
```

### 3. Run Locally (Node.js)

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) or check the health endpoints:

- `GET /api/health`
- `GET /api/ready`

## Quality Checks & Commands

| Task                    | Command               | Description                                                |
| ----------------------- | --------------------- | ---------------------------------------------------------- |
| Architecture Guardrails | `pnpm run arch:check` | Verifies DDD boundary enforcement                          |
| Linting                 | `pnpm run lint`       | ESLint strict check & max lines rule (200)                 |
| Type Check              | `pnpm run typecheck`  | Strict TypeScript compilation (`noUncheckedIndexedAccess`) |
| Unit Tests              | `pnpm run test:unit`  | Vitest unit test suite                                     |
| Integration Tests       | `pnpm run test:int`   | Vitest integration test suite                              |
| End-to-End Tests        | `pnpm run test:e2e`   | Playwright e2e test suite                                  |
| Docker Production       | `pnpm run docker:up`  | Runs production multi-stage standalone build               |

## Production Deployment

```bash
docker compose up -d --build
```
