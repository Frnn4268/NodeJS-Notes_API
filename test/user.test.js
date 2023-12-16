const mongoose = require('mongoose')
const { server } = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('../helpers/helpers')

// Test suite for creating a new user
describe('Creating a new user', () => {
  // Set up a user with a hashed password before each test
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345', 10)

    const user = new User({
      username: 'Frnn',
      passwordHash
    })

    await user.save()
  })

  // Test case: Creating a user with a duplicate username should fail
  test('Works as expected creating a fresh username (POST)', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'Frnn',
      name: 'Fernando',
      password: 'F3rnn'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const userNames = usersAtEnd.map(uNames => uNames.username)
    expect(userNames).toContain(newUser.username)
  })

  // Test case: Creating a user with an existing username should fail
  test('Creating fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'Frnn',
      name: 'Fernando',
      password: '1234'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('username to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  // Clean up after all tests by closing the server and mongoose connection
  afterAll(() => {
    server.close()
    mongoose.connection.close()
  })
})
