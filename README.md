# Journdev

## Self hosting

_TODO_

### Cli

We have a minimal cli in scripts/journdev_cli. You can run it with `node scrips/journdev_cli <command> [<args>]`
Commands available:

- `register-user`: registers a user in the DB

## Contributing

### Setting up development environment

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

- Register yourself:

```bash
node scripts/journdev_cli register-user
```

- Go to http://localhost:3000

- Teardown

```bash
make teardown
```
