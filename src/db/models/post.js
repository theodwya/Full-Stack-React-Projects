// Import the mongoose and the Schema classes from mongoose.
import mongoose, { Schema } from 'mongoose'

// Define a schema for posts.
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: String,
    contents: String,
    tags: [String],
  },
  { timestamps: true },
)

// Create a Mongoose model from the schema by using the mongoose.model() function.
export const Post = mongoose.model('post', postSchema)
