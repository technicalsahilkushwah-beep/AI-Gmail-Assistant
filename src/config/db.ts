import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MongoDb uri is Missing in .env.local");
}

const client = new MongoClient(uri);

export { client };

export const db = client.db("Ai_Gmail_Assistant");
