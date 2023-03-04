const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('express-async-errors')
const corsOptions = require('./config/corsOptions')

//
const app = express()

// enable to .env
dotenv.config()

// adding index.html
app.use(express.static('./public'))

// DB File
const connectDB = require('./db/dbConnect')

// routes
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute')

app.use(express.json())

// allowed origins
app.use(cors(corsOptions))

console.log('hello')

//
app.use('/api/auth', authRoute)
app.use('/api/products', productRoute)

// SERVER
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on : ' + process.env.PORT)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
