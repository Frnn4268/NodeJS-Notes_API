const logger = (request, response, next) => {
  // Middleware for logging request details
  console.log('_______')
  console.log(request.method)
  console.log(request.path)
  console.log('')
  next()
}

module.exports = logger
