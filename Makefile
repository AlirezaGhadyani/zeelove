.PHONY: install dev build start lint lint-fix format typecheck test-unit test-int test test-e2e arch-check docker-up docker-down docker-dev

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

typecheck:
	npm run typecheck

test-unit:
	npm run test:unit

test-int:
	npm run test:int

test:
	npm run test

test-e2e:
	npm run test:e2e

arch-check:
	npm run arch:check

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-dev:
	docker compose -f docker-compose.dev.yml up
