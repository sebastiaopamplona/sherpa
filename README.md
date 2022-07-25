# Journdev

## Setting up development environment

- Install Node lts, for example using NVM:

```bash
nvm install --lts
```

- Install Docker https://docs.docker.com/engine/install/ubuntu/
- (Optional) Install Beekeper (DB ui) https://www.beekeeperstudio.io/
- Start a Postgres DB with Docker

```bash
docker run -p 5432:5432 \
        -e PGUSER=postgres \
        -e PGDATABASE=postgres \
        -e POSTGRES_DB=postgress \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=secret \
        postgres
```

- (Optional) Open Beekeper and connect to DB using the `journdev` as the DB name
- Apply the latest prisma migration

```sh
npx prisma migrate deploy
```

- On Beekeper, check that the tables are now in the DB
- Start the application

```sh
npm run dev
```

- Go to http://localhost:3000 and login with GitHub
