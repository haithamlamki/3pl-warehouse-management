## Backend Quickstart

1. Copy env:
```
cp .env.example .env
```

2. Install and build:
```
npm ci
npm run build
```

3. Run locally:
```
npm run start:dev
```

4. Run with Docker Compose (Postgres + API):
```
docker compose up -d --build
```

5. Swagger docs:
```
http://localhost:3001/api/docs
```

6. Migrations (disable synchronize in production):
```
npm run migration:generate -- src/database/migrations/<name>
npm run migration:run
```


