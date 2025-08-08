// Import the createServer function from the node:http module.
import { createServer } from 'node:http'

// The createServer function is asynchronous, so requires a callback function.
// The function will be executed when a request comes in from the server.
// It has two arguments a request object (req) and a response object(res).
// Use createServer function to define a new server.
const server = createServer((req, res) => {
  // For now, we will ignore the request object and only return a static response.
  res.statusCode = 200

  // Set the Content-Type header to text/plain. This allows browser
  // to know kind of response data it is handling.
  res.setHeader('Content-Type', 'text/plain')

  // Return a Hello HTTP world! string in the response
  res.end('Hello HTTP world!')
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
