SHELL := /bin/bash

startlocal: teardown
	docker run -d --name journdev-local-db \
		-p 5432:5432 \
		-e PGUSER=postgres \
		-e PGDATABASE=postgres \
		-e POSTGRES_DB=postgress \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=secret \
		postgres
	sleep 5
	DATABASE_URL="postgresql://postgres:secret@localhost:5432/postgres" npx prisma migrate reset
	DATABASE_URL="postgresql://postgres:secret@localhost:5432/postgres" npm run dev

teardown:
	docker rm -f journdev-local-db
