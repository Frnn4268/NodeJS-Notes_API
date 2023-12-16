const homeRouter = require('express').Router()

// Handle GET requests to the root endpoint
homeRouter.get('/', (request, response) => {
  // Send a simple HTML response with a greeting
  response.send('<h1>Hello World!</h1>')
})

module.exports = homeRouter
