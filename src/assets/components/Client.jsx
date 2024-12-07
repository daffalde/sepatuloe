import { Account, Client, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const database = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

export { database, account, storage };
