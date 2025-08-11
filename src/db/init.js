// Import mongoose to create database schemas.
import mongoose from 'mongoose'

// Define and export function that will initialize the database connection.
export function initDatabase() {
  // Define the DATABASE_URL to point to local MongoDB instance running via Docker.
  // Specify blog as the database name.
  const DATABASE_URL = process.env.DATABASE_URL

  // Add a listener to the open event on the Mongoose connection.
  // Showing a log message once connected to the database.
  mongoose.connection.on('open', () => {
    console.info('successfully connected to database:', DATABASE_URL)
  })

  // Use the mongoose.connect function to connect MongoDB database and return the connection object.
  const connection = mongoose.connect(DATABASE_URL)
  return connection
}
