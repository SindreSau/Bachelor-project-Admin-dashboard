# Bachelor Admin Dashboard

## Getting Started

Install dependencies

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Set up azurite and postgres

Requires docker installed

1. Remember to update .env

```bash
cp .env.example .env
```

2. Set up azurite and postgresql docker containers

```bash
docker-compose up -d
```

## Prisma setup

1. Remember to rerun pnpm install

```bash
pnpm install
```

2. Run prisma generate to generate the prisma client

```bash
pnpm db:generate
```

3. Run prisma migrate (creates the tables in the database and runs seed.ts)

```bash
pnpm db:migrate
```

4. Run prisma studio to view the database

```bash
pnpm db:studio
```

### Other things related to Prisma

- I have made changes to the schema.prisma file - rerun migrations and give the migration a suitable name

```bash
pnpm db:migrate
```

- To seed the database manually

```bash
pnpm db:seed
```
