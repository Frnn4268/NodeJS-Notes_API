const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

// Handle GET requests to retrieve all users with their associated notes
usersRouter.get('/', async (request, response, next) => {
  try {
    // Fetch all users from the database and populate notes details using the "populate" function
    const users = await User.find({}).populate('notes', {
      content: 1,
      date: 1,
      _id: 0
    })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

// Handle GET requests to retrieve a specific user by ID
usersRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    // Find a user by their ID in the database
    const user = await User.findById(id)

    // Respond with the user if found, otherwise return a 404 status
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// Handle POST requests to create a new user
usersRouter.post('/', async (request, response, next) => {
  const { body } = request
  const { username, name, password } = body

  // Hash the provided password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Create a new user with the provided details
  const newUser = new User({
    username,
    name,
    passwordHash
  })

  try {
    // Save the new user to the database
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json(error)
  }
})

// Handle PUT requests to update a user by ID
usersRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const user = request.body

  // Extract relevant information from the request body
  const newUserInfo = {
    username: user.username,
    name: user.name,
    password: user.passwordHash
  }

  try {
    // Find and update the user in the database, returning the updated user
    const result = await User.findByIdAndUpdate(id, newUserInfo, { new: true })
    response.json(result)
  } catch (error) {
    next(error)
  }
})

// Handle DELETE requests to delete a user by ID
usersRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    // Find and delete the user in the database
    await User.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
