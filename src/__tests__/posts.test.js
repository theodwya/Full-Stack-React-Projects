import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/post.js'
import { Post } from '../db/models/post.js'

// Use the describe() function to define a new test. This function descirbes a group of tests.
describe('creating posts', () => {
  // Define a test by using the test() function. Pass an async function to be able to use async/await syntax.
  test('with all parameters should succeed', async () => {
    // Use the createPost function to create a new post with some parameters.
    const post = {
      title: 'Test Post',
      author: 'Test Author',
      contents: 'This is a test post.',
      tags: ['test', 'post'],
    }
    const createdPost = await createPost(post)
    // Verify that it returns a post with an ID by using the expect() function from Jest.
    // Use the toBeInstanceOf matcher to verify that it is an ObjectId.
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    // Use Mongoose directly to find the post with given ID.
    const foundPost = await Post.findById(createdPost._id)

    // Use the expect() function the foundPost to equal an object containing at least the properties of the original post object we defined.
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  // Define a second test called creating posts without title should fail.
  test('without title should fail', async () => {
    const post = {
      author: 'Test Author',
      contents: 'This is a test post without a title.',
      tags: ['test', 'post'],
    }
    // Use a try/catch construct to catch the error and expect() the error to be a Mongoose ValidationError.
    try {
      await createPost(post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  // Define a third test called creating posts with minimal parameters should succeed and only enteer the title.
  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

// Define an array of sample posts
const samplePost = [
  { title: 'Learning Redux', author: 'Teddy Wyatt', tags: ['redux'] },
  { title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react'] },
  {
    title: 'Full-Stack React Projects',
    author: 'Teddy Wyatt',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to TypeScript' },
]

// Define an empty array, populated with the created posts.
let createdSamplePosts = []

// Define a beforeEach function which clears all post from the database, and clears array of created sample post.
// It then creates the sample post in the database again for each of the post defined in the array above.
// This ensures a consistent state of the database before each test case runs.
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePost) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

// Define a new test group for listing post
describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  // Define a test for checking the default sort order of posts, with the most recent post first.
  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })

  // Define a test case where the sortBy values is changed to updatedAt and the sortOrder value is changed to ascending.
  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })

  // Define a test case that list post by author works.
  test('should be able filter posts by author', async () => {
    const posts = await listPostsByAuthor('Teddy Wyatt')
    expect(posts.length).toBe(2)
  })

  // Define a test case that list posts by tag works.
  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('react')
    expect(posts.length).toBe(2)
  })
})

// Define tests for getting a post by ID and failing to get a post because the ID did not exist in the database.
describe('getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

// Define test for updating a post successfully. One test to verify the specified property was changed, and another to verify that it does not interfere with other properties.
describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Dr. Angel Wyatt',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual('Dr. Angel Wyatt')
  })
  test('should not update other properties', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Dr. Angel Wyatt',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })

  // Define a test to ensure updatedAt timestamp is updated. First convert the Date objects to numbers by using .getTime(), and then we can compare them by using the expect(…).toBeGreaterThan(…) matcher.
  test('should update the updatedAt timestamp', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Dr. Angel Wyatt',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  // Define a failing test to see if the updatedPost function returns null when no post with a matching ID exists.
  test('should fail if the id does not exist', async () => {
    const post = await updatePost('000000000000000000000000', {
      author: 'Dr. Angel Wyatt',
    })
    expect(post).toEqual(null)
  })
})

// Define test for successful and unsuccessful deletes by checking if the post was deleted and verifying the returned deletedCount.
describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
