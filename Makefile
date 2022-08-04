SHELL := /bin/bash

startlocal:
	docker run -d --name journdev-local-db \
		-p 5432:5432 \
		-e PGUSER=postgres \
		-e PGDATABASE=postgres \
		-e POSTGRES_DB=postgress \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=secret \
		postgres
	sleep 5
	npx prisma migrate reset -f
	npm run dev

teardown:
	docker rm -f journdev-local-db