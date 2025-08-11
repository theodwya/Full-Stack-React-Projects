// Define a beforeAll function to initialize the database connection in Mongoose before all test run
// Define an afterAll function to disconnect from the database after all test finish.

import mongoose from 'mongoose'
import { beforeAll, afterAll } from '@jest/globals'
import { initDatabase } from '../db/init.js'

beforeAll(async () => {
  // Initialize the database connection.
  await initDatabase()
})

afterAll(async () => {
  // Disconnect from the database.
  await mongoose.disconnect()
})
