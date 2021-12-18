This module creates a [Fastify](https://fastify.io/) server with a [Socket.IO](https://socket.io/) server attatched.
Additionally, it exports simple functions for serving directories and adding database/mail providers.

- [JavaScript API](#javascript-api)
  - [server: FastifyInstance](#server-fastifyinstance)
    - [server.database: DatabaseProvider](#serverdatabase-databaseprovider)
    - [server.mailer: MailProvider](#servermailer-mailprovider)
    - [server.io: SocketIOInstance&lt;IOEvents, IOEvents, IOServerEvents>](#serverio-socketioinstanceioevents-ioevents-ioserverevents)
  - [listen(port: number, host?: string, backlog?: number): Promise&lt;void>](#listenport-number-host-string-backlog-number-promisevoid)
  - [addProvider&lt;T extends keyof Providers>(type: T, provider: Providers[T]): void](#addprovidert-extends-keyof-providerstype-t-provider-providerst-void)
  - [hasProvider(type: keyof Providers): boolean](#hasprovidertype-keyof-providers-boolean)
  - [onProvider(type: keyof Providers): boolean](#onprovidertype-keyof-providers-boolean)
  - [serveDirectory(root: string, prefix?: string): void](#servedirectoryroot-string-prefix-string-void)
- [TypeScript API](#typescript-api)
  - [interface Collection&lt;T extends Table>](#interface-collectiont-extends-table)
    - [Collection.find(query: Partial&lt;T>): Promise&lt;readonly Readonly<T>[]>](#collectionfindquery-partialt-promisereadonly-readonlyt)
    - [Collection.insert(...documents: T[]): Promise&lt;void>](#collectioninsertdocuments-t-promisevoid)
    - [Collection.update(query: Partial&lt;T>, data: Partial&lt;T>): Promise&lt;void>](#collectionupdatequery-partialt-data-partialt-promisevoid)
    - [Collection.delete(query: Partial&lt;T>): Promise&lt;void>](#collectiondeletequery-partialt-promisevoid)
  - [interface Database extends StructuredDatabase](#interface-database-extends-structureddatabase)
  - [interface DatabaseProvider](#interface-databaseprovider)
    - [DatabaseProvider.collection&lt;T extends keyof Database>(table: T): Promise&lt;Collection&lt;Database[T]>>](#databaseprovidercollectiont-extends-keyof-databasetable-t-promisecollectiondatabaset)
  - [interface IOEvents](#interface-ioevents)
  - [interface IOServerEvents](#interface-ioserverevents)
  - [interface MailProvider](#interface-mailprovider)
  - [interface Providers](#interface-providers)
  - [interface Table](#interface-table)
  - [type StructuredDatabase = { [table: string]: Table }](#type-structureddatabase---table-string-table-)

# JavaScript API

## server: FastifyInstance

The main Fastify server.

### server.database: DatabaseProvider

The server's database provider. See [interface DatabaseProvider](#interface-databaseprovider) for more information.

NOTICE: This property may not exist. To check if a database provider has been added using [addProvider()](#addprovidertype-string-provider-provider-void), use [hasProvider()](#hasprovidertype-string-boolean) or [onProvider()](#onprovidertype-string-boolean).

### server.mailer: MailProvider

The server's mail provider. See [interface MailProvider](#interface-mailprovider) for more information.

NOTICE: This property may not exist. To check if a mail provider has been added using [addProvider()](#addprovidert-extends-keyof-providerstype-t-provider-providerst-void), use [hasProvider()](#hasprovidertype-keyof-providers-boolean) or [onProvider()](#onprovidertype-keyof-providers-boolean).

### server.io: SocketIOInstance&lt;IOEvents, IOEvents, IOServerEvents>

The server's Socket.IO instance.

## listen(port: number, host?: string, backlog?: number): Promise&lt;void>

Starts listening for connections on the server instance.
Returns a promise that resolves once the server accepts connections.

- `port: number` - The port to listen on.
- `host?: string` - The host to listen on.
- `backlog?: number` - The number of connections to backlog before refusing new connections.

## addProvider&lt;T extends keyof Providers>(type: T, provider: Providers[T]): void

This function is also added as a server instance method as `server.addProvider`.

Adds a database or mail provider to the server instance.

- `type: T` - The type of provider to add.
- `provider: Providers[T]` - The provider to add.

## hasProvider(type: keyof Providers): boolean

This function is also added as a server instance method as `server.hasProvider`.

Checks if a provider has been added to the server instance.
Returns a boolean indicating if the server has the provider.

- `type: keyof Providers` - The type of provider to check for.

## onProvider(type: keyof Providers): boolean

This function is also added as a server instance method as `server.onProvider`.

Waits for a provider to be added to the server instance.
A boolean indicating if the server has the provider.

- `type: keyof Providers` - The type of provider to wait for.

## serveDirectory(root: string, prefix?: string): void

This function is also added as a server instance method as `server.serveDirectory`.

Serves a directory of static files.

- `root: string` - A path to the directory containing files to send to the client.
- `prefix?: string` - An optional prefix to serve files under.

# TypeScript API

## interface Collection&lt;T extends Table>

An interface all database collections must implement.

### Collection.find(query: Partial&lt;T>): Promise&lt;readonly Readonly<T>[]>

Find documents in the collection.
Returns a promise resolving to an array of documents.

- `query: Partial<T>` - A filter to match documents against.

### Collection.insert(...documents: T[]): Promise&lt;void>

Inserts documents into the collection.
Returns a promise resolving once the documents have been inserted.

- `...documents: T[]` - The documents to insert.

### Collection.update(query: Partial&lt;T>, data: Partial&lt;T>): Promise&lt;void>

Updates documents in the collection.
Returns a promise resolving once the documents have been updated.

- `query: Partial<T>` - A filter to match documents against.
- `data: Partial<T>` - The data to update the documents with.

### Collection.delete(query: Partial&lt;T>): Promise&lt;void>

Deletes documents from the collection.
Returns a promise resolving once the documents have been deleted.

- `query: Partial<T>` - A filter to match documents against.

## interface Database extends StructuredDatabase

A list of collections in the main database. Used for autocomplete.

## interface DatabaseProvider

The interface a database provider must implement.

### DatabaseProvider.collection&lt;T extends keyof Database>(table: T): Promise&lt;Collection&lt;Database[T]>>

Gets a collection from the database.
Returns a promise resolving with a collection instance for the given table.

- `table: T` - The name of the collection to get.

## interface IOEvents

A collection of client events that can be used by the socket.io instance.

## interface IOServerEvents

A collection of server events that can be used by the socket.io instance.

## interface MailProvider

An interface all mail providers must implement.

## interface Providers

A list of providers that can be added to the server instance.

## interface Table

A type alias for a database table.

## type StructuredDatabase = { [table: string]: Table }

The base structure for a database.
