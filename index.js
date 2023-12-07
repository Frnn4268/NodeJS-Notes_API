const express = require('express')
const cors = require('cors')

require('dotenv').config()
require('./mongo.js')

const app = express()
const Note = require('./models/Note.js')
const notFound = require('./middlewares/notFound.js')
const handleError = require('./middlewares/handleError.js')
const logger = require('./middlewares/loggerMiddleware')
// const startServerMiddleware = require('./server.js')

app.use(express.json())
app.use(logger)
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', async (resquest, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.post('/api/notes', async (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = Note({
    content: note.content,
    date: new Date().toISOString(),
    important: note.important || false
  })

  try {
    const savedNote = await newNote.save({})
    response.json(savedNote)
  } catch (error) {
    console.error(error)
  }
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
})

app.delete('/api/notes/:id', async (request, response, next) => {
  const { id } = request.params
  await Note.findByIdAndDelete(id)
  response.status(204).end()
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

app.use(notFound) // Middleware notFound.js
app.use(handleError) // Middleware handleError.js

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
