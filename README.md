# Installation

In **back** folder:
- install dependencies, run `composer install`
- setup postgreSQL DB container, run `docker compose up -d`
- run migrations: `php bin/console doctrine:migrations:migrate`
- run fixtures: `php bin/console doctrine:fixtures:load`

In **front** folder:
- install dependencies, run `yarn install`


# Development

In **back** folder:
- start server, run `symfony server:start -d`
- stop server, run `symfony local:server:stop`

In **front** folder:
- start server, run `yarn run dev`