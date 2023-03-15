# Development Commands

## Prisma:
- `$ npx prisma db push` -- Use this command during development to keep updating and making changes to the initial state of the DB. See more in the [Prototyping section of Prisma Docs](https://www.prisma.io/docs/guides/database/prototyping-schema-db-push)

- `$ npx prisma migrate dev --name init-state` -- Use this command when you have defined the initial state, and would like to start tracking DB histories.

- `$ npx prisma generate` -- needs to be manually invoked after changes to the schema, in order for Prisma Client to be updated to accomodate the new schema

----

- `$ npx prisma studio` -- spin up a GUI to view and interact with your data. This opens in your browser.
- `$ npx prisma format` -- format the prisma.schema file
- `$ npx prisma-repl` -- spin up an interactive command line tool, similar to Laraval Tinker or Rails Console. [Docs here](https://www.npmjs.com/package/prisma-repl)


## Database
- local database is named `familyfantasy`
- access it through SequelPro, or by command line: `$ mysql -uroot`

### Seeding
- `node database/seeder.js`

## Server
- `$ node index.js` -- to start the server at localhost:3000