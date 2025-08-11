// Import the service functions
import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/post.js'

// Create postsRoutes function takes the Express app as an argument.
export function postsRoutes(app) {
  // Define the routes. Start with the GET /api/v1/posts route.
  app.get('/api/v1/posts', async (req, res) => {
    // Use of query params (req.query in Express) to map them to the arguments of our functions.
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }

    // Use a try-catch block to handle errors.
    try {
      // Check if author and tag are provided, If both provided return a 400 Bad Request status code, and JSON object with an error message by calling res.json().
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'query by either author or tag, not both' })
        // Otherwise call the respective functon and return a JSON repsonse in Express by calling res.json(). In case an error happended, we catch it, log it, and return a 500 status code.
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      console.error('error listing posts', err)
      return res.status(500).end()
    }
  })

  // Define an API route to get a single post, use the :id param placeholder to be able to access it as a dynamic parameter in the function.
  app.get('/api/v1/posts/:id', async (req, res) => {
    // Access req.params.id to get the :id part of the route and pass it to the service function.
    const { id } = req.params
    try {
      const post = await getPostById(id)
      // If the result of the function is null return a 404 response, otherwise return the post as JSON repsonse.
      if (post === null) return res.status(404).end()
      return res.json(post)
    } catch (err) {
      console.error('error getting post', err)
      return res.status(500).end()
    }
  })

  // Define the post /api/v1/posts route by using app.post and req.body inside of postsRoutes function.
  app.post('/api/v1/posts', async (req, res) => {
    try {
      const post = await createPost(req.body)
      return res.json(post)
    } catch (err) {
      console.error('error creating post', err)
      return res.status(500).end()
    }
  })

  // Define the update route, where we need to make use of the id param and the request body.
  app.patch('/api/v1/posts/:id', async (req, res) => {
    try {
      const post = await updatePost(req.params.id, req.body)
      return res.json(post)
    } catch (err) {
      console.error('error updating post', err)
      return res.status(500).end()
    }
  })

  // Define the delete route, where we need to make use of the id param.
  app.delete('/api/v1/posts/:id', async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (err) {
      console.error('error deleting post', err)
      return res.status(500).end()
    }
  })
}
