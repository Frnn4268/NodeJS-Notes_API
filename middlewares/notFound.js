module.exports = (request, response, next) => {
  // Middleware for handling 404 errors
  response.status(404).end()
}
