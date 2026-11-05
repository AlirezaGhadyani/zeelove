.PHONY: install dev build start lint lint-fix format typecheck test-unit test-int test test-e2e arch-check docker-up docker-down docker-dev

install:
	pnpm install

dev:
	pnpm run dev

build:
	pnpm run build

start:
	pnpm run start

lint:
	pnpm run lint

lint-fix:
	pnpm run lint:fix

format:
	pnpm run format

typecheck:
	pnpm run typecheck

test-unit:
	pnpm run test:unit

test-int:
	pnpm run test:int

test:
	pnpm run test

test-e2e:
	pnpm run test:e2e

arch-check:
	pnpm run arch:check

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-dev:
	docker compose -f docker-compose.dev.yml up
