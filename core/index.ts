import { fastify, FastifyInstance } from "fastify";
import fastifyStatic from "fastify-static";
import { ServerResponse } from "http";
import { Server } from "socket.io";

/** The main Fastify server. */
export const server = fastify();

server.addHook("preHandler", (req, res, next) => {
  res.header(
    "content-security-policy",
    "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; report-uri /csp"
  );

  next();
});

server.decorate("io", new Server<IOEvents>(server.server));
server.decorate("addProvider", addProvider);
server.decorate("hasProvider", hasProvider);
server.decorate("onProvider", onProvider);
server.decorate("serveDirectory", serveDirectory);

/**
 * Starts listening for connections on the server instance.
 * @param port The port to listen on.
 * @param host The host to listen on.
 * @param backlog The number of connections to backlog before refusing new connections.
 * @returns A promise that resolves once the server accepts connections.
 */
export async function listen(
  port: number,
  host?: string,
  backlog?: number
): Promise<void> {
  await server.listen({ port, host, backlog });
}

/** A list of providers that can be added to the server instance. */
export interface Providers {
  database: DatabaseProvider;
  mailer: MailProvider;
}

/** Resolve functions for providers. Used by addProvider, hasProvider, and onProvider. */
let resolvers: { [K in keyof Providers]?: () => void } = {};

/** Internal data used to check providers. Used by addProvider, hasProvider, and onProvider */
let providers: {
  isAdded: { [K in keyof Providers]: boolean };
  resolvers: { [K in keyof Providers]?: () => void };
  promises: { [K in keyof Providers]: Promise<void> };
} = {
  isAdded: { database: false, mailer: false },
  resolvers: resolvers,
  promises: {
    database: new Promise((res) => (resolvers.database = res)),
    mailer: new Promise((res) => (resolvers.mailer = res)),
  },
};

/**
 * Adds a database or mail provider to the server instance.
 * @param type The type of provider to add.
 * @param provider The provider to add.
 */
export function addProvider<T extends keyof Providers>(
  type: T,
  provider: Providers[T]
): void {
  if (!(type in providers.isAdded))
    throw new Error(`Unknown provider type: ${type}`);

  if (providers.isAdded[type] == true)
    throw new Error(`Server already has provider for ${type}`);

  providers.resolvers[type]!();
  server.decorate(type, provider as any);
}

/**
 * Checks if a provider has been added to the server instance.
 * @param provider The type of provider to check for.
 * @returns A boolean indicating if the server has the provider.
 */
export function hasProvider(provider: keyof Providers): boolean {
  return providers.isAdded[provider];
}

/**
 * Waits for a provider to be added to the server instance.
 * @param provider The type of provider to listen for.
 * @returns A promise resolving once the provider has been added.
 */
export function onProvider(provider: keyof Providers): Promise<void> {
  return providers.promises[provider];
}

function setHeaders(res: ServerResponse, path: string) {
  if (path.substring(path.length - 3) == ".ts")
    res.setHeader("content-type", "text/typescript");
  else if (path.substring(path.length - 4) == ".ejs")
    res.setHeader("content-type", "text/html");
}

/**
 * Serves a directory of static files.
 * @param root A path to the directory containing files to send to the client.
 * @param prefix An optional prefix to serve files under.
 */
export function serveDirectory(root: string, prefix: string = "/") {
  server.register(fastifyStatic, {
    root,
    prefix,
    setHeaders,
    decorateReply: false,
    wildcard: false,
  });
}

/** A collection of client events that can be used by the socket.io instance. */
export interface IOEvents {}

/** A collection of server events that can be used by the socket.io instance. */
export interface IOServerEvents {}

/** A type alias for a database table. */
export interface Table {}

/** An interface all database collections must implement. */
export interface Collection<T extends Table> {
  /**
   * Finds documents in the collection.
   * @param query A filter to match documents against.
   * @returns A promise resolving to an array of documents.
   */
  find(query: Partial<T>): Promise<readonly Readonly<T>[]>;

  /**
   * Inserts documents into the collection.
   * @param documents The documents to insert.
   * @returns A promise resolving once the documents have been inserted.
   */
  insert(...documents: T[]): Promise<void>;

  /**
   * Updates documents in the collection.
   * @param query A filter to match documents against.
   * @param data The data to update the documents with.
   * @returns A promise resolving once the documents have been updated.
   */
  update(query: Partial<T>, data: Partial<T>): Promise<void>;

  /**
   * Deletes documents from the collection.
   * @param query A filter to match documents against.
   * @returns A promise resolving once the documents have been deleted.
   */
  delete(query: Partial<T>): Promise<void>;
}

/** The interface a database provider must implement. */
export interface DatabaseProvider {
  /**
   * Gets a collection from the database.
   * @param table The name of the collection to get.
   * @returns A promise resolving with a collection instance for the given table.
   */
  collection<T extends keyof Database>(
    table: T
  ): Promise<Collection<Database[T]>>;
}

/** A list of collections in the main database. Used for autocomplete. */
export interface Database extends StructuredDatabase {}

/** The base structure for a database. */
export type StructuredDatabase = { [table: string]: Table };

/** An interface all mail providers must implement. */
export interface MailProvider {}

declare module "fastify" {
  interface FastifyInstance {
    /** The server's database provider. */
    database: DatabaseProvider;

    /** The server's mail provider. */
    mailer: MailProvider;

    /** The server's Socket.io server. */
    io: Server<IOEvents, IOEvents, IOServerEvents>;

    /**
     * Adds a database or mail provider to the server instance.
     * @param type The type of provider to add.
     * @param provider The provider to add.
     */
    addProvider: typeof addProvider;

    /**
     * Checks if a provider has been added to the server instance.
     * @param provider The provider to check for.
     * @returns A boolean indicating if the server has the provider.
     */
    hasProvider: typeof hasProvider;

    /**
     * Waits for a provider to be added to the server instance.
     * @param provider The provider to listen for.
     * @returns A promise resolving once the provider has been added.
     */
    onProvider: typeof onProvider;

    /**
     * Serves a directory of static files.
     * @param root A path to the directory containing files to send to the client.
     * @param prefix An optional prefix to serve files under.
     */
    serveDirectory: typeof serveDirectory;
  }
}
