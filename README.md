___
# Description

This is a simple app to help manage and track scores and standings in a custom fantasy sports league.
## Tech Stack

- [Express.js](expressjs.com/) server with the [Pug](pugjs.org/) template engine.
- [Chota](https://jenil.github.io/chota/#!) micro CSS framework.
- [Prisma](https://www.prisma.io/) ORM.
- MySQL database.
- [PlanetScale](https://planetscale.com/) for database deployment and management.
- (Soon) [Fly.io](fly.io/) for server deployment.


---

# Development Commands

## Prisma:
- `$ npx prisma db push` -- Use this command during development to keep updating and making changes to the initial state of the DB. See more in the [Prototyping section of Prisma Docs](https://www.prisma.io/docs/guides/database/prototyping-schema-db-push)

- `$ npx prisma migrate dev --name init-state` -- **Not Used with PlanetScale**. Use this command when you have defined the initial state, and would like to start tracking DB histories.

- `$ npx prisma generate` -- needs to be manually invoked after changes to the schema, in order for Prisma Client to be updated to accomodate the new schema
- `$ npx prisma studio` -- spin up a GUI to view and interact with your data. This opens in the browser.
- `$ npx prisma format` -- format the prisma.schema file
- `$ npx prisma-repl` -- spin up an interactive command line tool, similar to Laraval Tinker or Rails Console. [Docs here](https://www.npmjs.com/package/prisma-repl)



### PlanetScale
- `pscale connect <DB> <BRANCH> --port 3309` to proxy into the database (necessary for connecting to the remote PS db)
- `pscale shell <DB> <BRANCH>` to open an interactive MySQL shell in the terminal


## Development Start up
- `$ node index.js` -- to start the server at localhost:3000
- `pscale connect <DB> <BRANCH>` -- to connect to PlanetScale DB (only required if developing by connecting to PlanetScale)