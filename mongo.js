const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

// Determine the appropriate MongoDB connection string based on the environment
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

// Connect to MongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected!')
  })
  .catch(err => {
    console.error(err)
  })

// Handle uncaught exceptions by disconnecting from the MongoDB database
process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})
