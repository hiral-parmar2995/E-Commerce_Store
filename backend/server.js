const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const http = require('http') 

dotenv.config()

const authRoutes = require('./routes/authRoutes')
const orderRoutes = require('./routes/orderRoutes')
const productRoutes = require('./routes/productRoutes')

const app = express()

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}))

app.use(express.json())

app.use((req, res, next) => {
  console.log(req.method, req.path)
  next()
})

app.use('/api/user', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/products', productRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

mongoose.connect(" ")
  .then(() => {
    console.log('Database connected!')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.error('Database connection error:', error)
  })