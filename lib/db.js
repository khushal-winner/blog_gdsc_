import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable")
}

let cached = global._mongooseConn
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB || "blogdb",
      })
      .then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}
