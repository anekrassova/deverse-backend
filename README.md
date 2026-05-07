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
- Cloudinary использует HTTPS API (порт отдельно не настраивается).

Пример (минимально важное):

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3307

CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dpdubktcq
```

## Запуск MySQL в Docker

В корне проекта:

```bash
docker compose up -d
```

Сервисы и порты по умолчанию:

- MySQL: `localhost:3307`

## Запуск backend

```bash
npm run dev
```

## Swagger

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`

## Режим только Swagger (без БД)

Если нужно просто посмотреть Swagger, можно поставить в .env:

```bash
DOCS_ONLY=1
```

и запустить:

```bash
npm run dev
```
