const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', async (resquest, response, next) => {
  try {
    const notes = await Note.find({})
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
