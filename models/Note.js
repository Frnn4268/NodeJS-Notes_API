const { model, Schema } = require('mongoose')

// Note Scheme
const noteScheme = new Schema({
  content: String,
  date: Date,
  important: Boolean
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

/*
const note = new Note({ // Creating an instance of Note
  content: 'MongoDB is incredible!',
  date: new Date(),
  important: true
})

note.save() // note.save() to save a note
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  }).catch(err => {
    console.error(err)
  })

Note.find({}).then(result => {
  console.log(result)
  mongoose.connection.close()
}).catch(err => {
  console.error(err)
})
*/
