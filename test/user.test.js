const mongoose = require('mongoose')
const { server } = require('../index')

const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('../helpers/helpers')

describe('Creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345', 10)

    const user = new User({
      username: 'Frnn',
      passwordHash
    })

    await user.save()
  })

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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const userNames = usersAtEnd.map(uNames => uNames.username)
    expect(userNames).toContain(newUser.username)
  })

  afterAll(() => {
    server.close()
    mongoose.connection.close()
  })
})
