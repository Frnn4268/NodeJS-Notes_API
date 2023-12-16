const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middlewares/userExtractor')

// Handle GET requests to retrieve all notes with user details
notesRouter.get('/', async (request, response, next) => {
  try {
    // Fetch all notes from the database and populate user details using the "populate" function
    const notes = await Note.find({}).populate('user', {
      username: 1,
      name: 1
    })
    response.json(notes)
  } catch (error) {
    next(error)
  }
})

// Handle GET requests to retrieve a specific note by ID
notesRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    // Find a note by its ID in the database
    const note = await Note.findById(id)

    // Respond with the note if found, otherwise return a 404 status
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// Handle POST requests to create a new note
notesRouter.post('/', userExtractor, async (request, response, next) => {
  // Destructuring request body to extract content and importance
  const {
    content,
    important = false
  } = request.body

  const { userId } = request

  // Find the user associated with the provided userId
  const user = await User.findById(userId)

  // Check if content is missing, return a 400 status with an error message¿
  if (!content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  // Create a new note with the provided details
  const newNote = Note({
    content,
    date: new Date().toISOString(),
    important,
    user: user._id
  })

  try {
    // Save the new note to the database
    const savedNote = await newNote.save()

    // Relate the new note to the user and save the user
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

// Handle PUT requests to update a note by ID
notesRouter.put('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  const note = request.body

  // Extract relevant information from the request body
  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  try {
    // Find and update the note in the database, returning the updated note
    const result = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    response.json(result)
  } catch (error) {
    next(error)
  }
})

// Handle DELETE requests to delete a note by ID
notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params

  try {
    // Find and delete the note in the database
    await Note.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
