const uniqueValidation = require('mongoose-unique-validation')
const { Schema, model } = require('mongoose')

const userSchema = new Schema({ // Creating the User model
  username: {
    type: String,
    unique: true // uniqueValidation true
  },
  name: String,
  passwordHash: String,
  notes: [{ // Reference to notes
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash // Deleting the pass
  }
})

userSchema.plugin(uniqueValidation) // Adding the unique validation to username

// User Model
const User = model('User', userSchema)

module.exports = User
