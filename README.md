# Journdev

## Setting up development environment

- Install Node lts, for example using NVM:

```bash
nvm install --lts
```

- Install Docker https://docs.docker.com/engine/install/ubuntu/
- (Optional) Install Beekeper (DB ui) https://www.beekeeperstudio.io/

- Start a local db, apply migrations, seed db and start application

```bash
make startlocal
```

- Go to http://localhost:3000 and login with GitHub

- Teardown

```bash
make teardown
```
