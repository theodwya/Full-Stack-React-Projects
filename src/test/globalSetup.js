// Import MongoMemoryServer to spin up an in-memory MongoDB database instance for testing.
import { MongoMemoryServer } from 'mongodb-memory-server'

// Define a global setup function  which creates a memory server for MongoDB.
export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    // Set the instance to use a specific version of MongoDB.
    binary: {
      version: '6.0.4',
    },
  })

  // Store the MongoDB instance as global variable to access it later in the globalTeardown function.
  global.__MONGOINSTANCE = instance

  // Store the URL to connect to our test instance in the DATABASE_URL environment variable.
  process.env.DATABASE_URL = instance.getUri()
}
