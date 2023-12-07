const supertest = require('supertest')

const { app } = require('../index')
const api = supertest(app)

const initialNotes = [
  {
    content: 'This is a Mongo DB Test using supertest',
    important: true,
    date: new Date()

  },
  {
    content: 'This is a Mongo DB Test using jest',
    important: true,
    date: new Date()

  },
  {
    content: 'This is a Mongo DB Test using jest',
    important: false,
    date: new Date()

  },
  {
    content: 'This is a Mongo DB Test using jest',
    important: false,
    date: new Date()

  },
  {
    content: 'This is a Mongo DB Test using cross',
    important: true,
    date: new Date()

  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')

  return {
    contents: response.body.map(note => note.content),
    response
  }
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes
}
