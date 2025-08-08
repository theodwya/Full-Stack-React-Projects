// Import writeFileSync and readFileSync function from node:fs internal Node.js module
import { writeFileSync, readFileSync } from 'node:fs'

// A simple array containing users, with a name and email
const users = [{ name: 'John Doe', email: 'john.doe@example.com' }]

// Before saving convert array file to a string by using JSON.stringify
const usersJson = JSON.stringify(users)

// Save the JSON string to a file using the writeFileSync function
// This function takes two arguments -> filename, then string to be written to the file
writeFileSync('backend/users.json', usersJson)

// After saving the file, attempt to read it again using readFileSync and parsing JSON string using JSON.parse
const readUsersJson = readFileSync('backend/users.json')
const readUsers = JSON.parse(readUsersJson)

// Finally log the parsed array
console.log(readUsers)
