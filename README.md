# Backend (локальный запуск)

## Требования

- Node.js + npm
- Docker (Docker Desktop) + Docker Compose

## Установка зависимостей

```bash
npm install
```

## Переменные окружения

Скопируй `.env.example` в `.env` и заполни значения.

Важные порты:

- `PORT` — порт приложения (по умолчанию `3000`)
- `MINIO_PORT` — порт MinIO S3 API (по умолчанию `9000`)

Пример (минимально важное):

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3307

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_PUBLIC_BASE_URL=http://localhost:9000
```

## Запуск MySQL и MinIO в Docker

В корне проекта:

```bash
docker compose up -d
```

Сервисы и порты по умолчанию:

- MySQL: `localhost:3307`
- MinIO S3 API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001`

## Запуск backend

```bash
npm run dev
```

## Swagger

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`

## Режим только Swagger (без БД и MinIO)

Если нужно просто посмотреть Swagger, можно поставить в .env:

```bash
DOCS_ONLY=1
```

и запустить:

```bash
npm run dev
```
