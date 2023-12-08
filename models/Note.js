const { Schema, model } = require('mongoose')

// Note Scheme
const noteScheme = new Schema({ // Creating the Note model
  content: String,
  date: Date,
  important: Boolean,
  user: { // Reference to user
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteScheme.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Note Model
const Note = model('Note', noteScheme)

module.exports = Note
