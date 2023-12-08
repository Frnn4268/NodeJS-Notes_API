const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const user = await User.findById(id)
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { body } = request
  const { username, name, password } = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.put('/:id', async (response, request, next) => {
  const { id } = request.params
  const user = request.body

  const newUserInfo = {
    username: user.username,
    name: user.name,
    password: user.passwordHash
  }

  try {
    const result = await User.findByIdAndUpdate(id, newUserInfo, { new: true })
    response.json(result)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    await User.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
