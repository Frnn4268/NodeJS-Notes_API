const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  // Extracting the authorization header and retrieving the token
  const authorization = request.get('authorization')
  let token = ''

  // Checking if the authorization header exists and starts with 'Bearer'
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7) // Extracting the token from the header
  }

  // Verifying the token using the SECRET_KEY
  const decodedToken = jwt.verify(
    token,
    process.env.SECRET_KEY,
    {
      expiresIn: 60 * 60 * 24 * 7
    }
  )

  // If the token is missing or invalid, return an unauthorized error
  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'Token is missing or invalid'
    })
  }

  // Extracting the user ID from the decoded token
  const { id: userId } = decodedToken
  request.userId = userId

  next()
}
