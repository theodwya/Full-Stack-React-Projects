// Import createServer function from the node:http module.
// Import MongoClient from the mongodb module.
import { createServer } from 'node:http'
import { MongoClient } from 'mongodb'

// Define the connection URL and database name and then create a new MongoDB client.
const url = 'mongodb://localhost:27017'
const dbName = 'ch2'
const client = new MongoClient(url)

// Connect to the database and log a message after successful connection, or
// log an error if the connection fails.
try {
  await client.connect()
  console.log('Successfully connected to database!')
} catch (err) {
  console.error('Error connecting to database:', err)
}

// Create an HTTP server that listens for requests.
const server = createServer(async (req, res) => {
  // Select the database from the client, and the `users` collection.
  const db = client.db(dbName)
  const users = db.collection('users')

  // Execute the find method on the `users` collection.
  // Call toArray method to resolve the iterator to an array.
  const userList = await users.find().toArray()

  // Set the status code and response header, and return the `users` list
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(userList))
})

// After defining the server, make sure to listen on certain host and port.
// These will define where the server will be available.
// Use localhost on port 3000 to make server is available via http://localhost:3000/.
const host = 'localhost'
const port = 3000

// The server.listen function is asynchronous and requires a callback function.
// This executes as oon as the server is up and running
server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`)
})
