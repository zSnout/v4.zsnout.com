import {
  DatabaseProvider,
  Collection,
  Table,
  Database,
  addProvider,
} from "@zsnout/core";
import {
  Db,
  MongoClient,
  MongoClientOptions,
  Collection as DBCollection,
} from "mongodb";

class MongoDB implements DatabaseProvider {
  constructor(private database: Db, private connect: Promise<any>) {}

  async collection<T extends keyof Database>(
    table: T
  ): Promise<Collection<Database[T]>> {
    await this.connect;

    return new MongoCollection<Database[T]>(
      this.database.collection(table as string)
    );
  }
}

class MongoCollection<T extends Table> implements Collection<T> {
  constructor(private collection: DBCollection) {}

  async find(query: Partial<T>) {
    return (await this.collection.find(query).toArray()) as T[];
  }

  async insert(...documents: T[]) {
    let { acknowledged } = await this.collection.insertMany(documents);

    if (!acknowledged) throw new Error("Insert failed");
    else return;
  }

  async update(query: Partial<T>, data: Partial<T>) {
    await this.collection.updateMany(query, { $set: data });
  }

  async delete(query: Partial<T>) {
    await this.collection.deleteMany(query);
  }
}

/**
 * Adds a database provider using MongoDB.
 * @param client The MongoClient instance to create a database provider from.
 * @param database The name of the database to use.
 * @returns A promise resolving to the MongoClient once connected.
 */
export function useClient(
  client: MongoClient,
  database: string
): Promise<MongoClient> {
  let connect = client.connect();
  addProvider("database", new MongoDB(client.db(database), connect));

  return connect;
}

/**
 * Creates a MongoClient instance and uses it as a database provider.
 * @param urlOrOptions Either a URL to connect to or a set of MongoDB options.
 * @param database The name of the database to use.
 * @returns A promise resolving to the MongoClient once connected.
 */
export function createClient(
  urlOrOptions: string | MongoClientOptions,
  database: string
): Promise<MongoClient> {
  let client: MongoClient;

  if (typeof urlOrOptions == "string") client = new MongoClient(urlOrOptions);
  else client = new MongoClient("mongodb://localhost:27017/", urlOrOptions);

  return useClient(client, database);
}
