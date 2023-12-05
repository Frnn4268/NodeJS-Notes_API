module.exports = (error, request, response, next) => { // Middleware to errors
  console.error(error)

  if (error.name === 'CastError') {
    response.status(400).send({
      error: 'id use is malform'
    })
  } else {
    response.status(500).end()
  }
}
