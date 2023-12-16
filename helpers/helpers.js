const supertest = require('supertest')

const { app } = require('../index')
const User = require('../models/User')
const api = supertest(app)

// Initial notes data for testing
const initialNotes = [
  {
    content: 'This is a MongoDB Test using supertest',
    important: true,
    date: new Date()
  },
  {
    content: 'This is a MongoDB Test using jest',
    important: true,
    date: new Date()
  },
  {
    content: 'This is a MongoDB Test using jest',
    important: false,
    date: new Date()
  },
  {
    content: 'This is a MongoDB Test using jest',
    important: false,
    date: new Date()
  },
  {
    content: 'This is a MongoDB Test using cross',
    important: true,
    date: new Date()
  }
]

// Function to retrieve all notes' content from the API
const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')

  return {
    contents: response.body.map(note => note.content),
    response
  }
}

// Function to retrieve all users from the database
const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  getUsers
}
