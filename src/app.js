// Import everything needed to setup an Express application.
import express from 'express'
import { postsRoutes } from './routes/posts.js'
import bodyParser from 'body-parser'
import cors from 'cors'

// Create a new Express application instance.
const app = express()

// Define routes on the Express application.
app.use(cors()) // Middleware to enable CORS
app.use(bodyParser.json()) // Middleware to parse JSON bodies
postsRoutes(app)
app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

// Export the app to use in other files.
export { app }
