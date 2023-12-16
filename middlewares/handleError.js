module.exports = (error, request, response, next) => {
  // Middleware for handling errors

  console.error(error)

  if (error.name === 'CastError') {
    // Handling CastError (e.g., invalid ID format)
    response.status(400).send({
      error: 'Invalid ID format'
    })
  } else {
    // Handling other errors with a generic 500 status code
    response.status(500).end()
  }
}
