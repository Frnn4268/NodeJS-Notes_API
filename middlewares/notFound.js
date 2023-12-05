module.exports = (request, response, next) => { // 404 Middleware
  response.status(404).end()
}
