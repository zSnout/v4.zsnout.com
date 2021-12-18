A zSnout-compatiable database provider for MongoDB.

- [Basic Usage](#basic-usage)
- [JavaScript API](#javascript-api)
  - [useClient(client: MongoClient, database: string): Promise&lt;MongoClient>](#useclientclient-mongoclient-database-string-promisemongoclient)
  - [createClient(urlOrOptions: string | MongoClientOptions, database: string): Promise&lt;MongoClient>](#createclienturloroptions-string--mongoclientoptions-database-string-promisemongoclient)
- [TypeScript API](#typescript-api)

# Basic Usage

This module provides two exports: `useClient` and `createClient`.

`useClient` takes a `MongoClient` instance and a string representing the name of the database used.
It returns a promise resolving once the database is connected.

```typescript
import { useClient } from "@zsnout/mongodb";
import { MongoClient } from "mongodb";

let client = new MongoClient("mongodb://localhost:27017");
useClient(client, "mydatabase");
```

`createClient` is almost the same, but accepts either a string or an object that is used to initialize a new `MongoClient` instance.

```typescript
import { createClient } from "@zsnout/mongodb";

createClient("mongodb://localhost:27017", "mydatabase");
// or
createClient({ ...options }, "mydatabase");
```

Because of the way `@zsnout/core` handles databases, you can use the database before the promise resolves.
To accomplish this, the `collection` method returns a promise that resolves once the database is connected.

```typescript
import { server } from "@zsnout/core";
import { createClient } from "@zsnout/mongodb";

createClient("mongodb://localhost:27017", "mydatabase");

server.database.collection("mycollection").then(async (collection) => {
  // this promise doesn't resolve until the database is connected

  await collection.insert({ name: "haha" });
  return collection.find({});
});
```

# JavaScript API

## useClient(client: MongoClient, database: string): Promise&lt;MongoClient>

Adds a database provider using MongoDB.
Returns a promise resolving to the MongoClient once connected.

- `client: MongoClient` - The MongoClient instance to create a database provider from.
- `database: string` - The name of the database to use.

## createClient(urlOrOptions: string | MongoClientOptions, database: string): Promise&lt;MongoClient>

Creates a MongoClient instance and uses it as a database provider.
Returns a promise resolving to the MongoClient once connected.

- `urlOrOptions: string | MongoClientOptions` - Either a URL to connect to or a set of MongoDB options.
- `database: string` - The name of the database to use.

# TypeScript API

This module does not have any type-specific exports.
