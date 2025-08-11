// Import Post model
import { Post } from '../db/models/post.js'

// Define a createPost function which takes an object with title, author, contents, and tags as arguments.
// Then creates and returns a new post.
export async function createPost({ title, author, contents, tags }) {
  const post = new Post({ title, author, contents, tags })
  return await post.save()
}

// Define an internal listPosts function that allows query posts and define a sort order.
// Use this function to define listAllPosts, listPostsByAuthor, and listPostsByTag functions.
async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}
export async function listAllPosts(options) {
  return await listPosts({}, options)
}
export async function listPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
}
export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

// Define the get single post, update and delete post functions.
export async function getPostById(postId) {
  return await Post.findById(postId)
}

// Define the updatePost function, It will take an ID of an existing post and an object of parameters to update.
export async function updatePost(postId, { title, author, contents, tags }) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author, contents, tags } },
    { new: true },
  )
}

// Define the deletePost function, takes an ID of an existing post and deletes it.
export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}
