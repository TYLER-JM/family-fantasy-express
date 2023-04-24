# Development Commands

## Prisma:
- `$ npx prisma db push` -- Use this command during development to keep updating and making changes to the initial state of the DB. See more in the [Prototyping section of Prisma Docs](https://www.prisma.io/docs/guides/database/prototyping-schema-db-push)

- `$ npx prisma migrate dev --name init-state` -- Use this command when you have defined the initial state, and would like to start tracking DB histories.

- `$ npx prisma generate` -- needs to be manually invoked after changes to the schema, in order for Prisma Client to be updated to accomodate the new schema

- `$ node server/cron.js` -- should be run daily to keep the database up to date while the season is ongoing. This is the command that will eventually be run automoatically.

----

- `$ npx prisma studio` -- spin up a GUI to view and interact with your data. This opens in your browser.
- `$ npx prisma format` -- format the prisma.schema file
- `$ npx prisma-repl` -- spin up an interactive command line tool, similar to Laraval Tinker or Rails Console. [Docs here](https://www.npmjs.com/package/prisma-repl)


## Database
- local database is named `familyfantasy`
- access it through SequelPro, or by command line: `$ mysql -uroot`

### PlanetScale
- `pscale connect family-fantasy main --port 3309` to proxy into the database (necessary for connecting to the remote PS db)
- `pscale shell family-fantasy main` to open an interactive MySQL shell in the terminal


### Seeding
- `node database/seeder.js`

## Development Start up
- `$ node index.js` -- to start the server at localhost:3000
- `pscale connect <DB> <branch>` -- to connect to PlanetScale DB (only required if developing by connecting to PlanetScale)