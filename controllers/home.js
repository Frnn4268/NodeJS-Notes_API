const homeRouter = require('express').Router()

homeRouter.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

module.exports = homeRouter
