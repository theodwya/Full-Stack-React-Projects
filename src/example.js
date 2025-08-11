// Import and run the initDatabase function
import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'

await initDatabase()

// Create a new blog post by calling new Post(), defining some example data.
const post = new Post({
  title: 'Hello Mongoose!',
  author: 'Daniel Bugl',
  contents: 'This post is stored in a MongoDB database using Mongoose.',
  tags: ['mongoose', 'mongodb', '#blogpost'],
})

// Update the post by using the findByIdAndUpdate method
// Call .save() on the blog post to save it to the database.
// Save the result of await post.save() in a createdPost constant
const createdPost = await post.save()
await Post.findByIdAndUpdate(createdPost._id, {
  $set: { title: 'Hello again, Mongoose!' },
})

// Use the find() function to list all posts, and log the result.
const posts = await Post.find()
console.log(posts)
