const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (resquest, response, next) => {
  try {
    const notes = await Note.find({}).populate('user', { // finding all users in the DB and creating a "join" with "POPULATE" function
      username: 1,
      name: 1
    })
    response.json(notes)
  } catch (error) {
    next(error)
  }
})

notesRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const note = await Note.findById(id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', async (request, response, next) => {
  const {
    content,
    important = false,
    userId
  } = request.body

  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = Note({
    content,
    date: new Date().toISOString(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save({})

    user.notes = user.notes.concat(savedNote._id) // Relating a note to the user
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  try {
    const result = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    response.json(result)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    await Note.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
