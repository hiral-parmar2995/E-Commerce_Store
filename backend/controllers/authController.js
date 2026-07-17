const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// REGISTER
const registerUser = async (req, res) => {
  const { name, email, password, cpassword } = req.body

  // 1. Validate all fields present
  if (!name || !email || !password || !cpassword) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  // 2. Password length check (before hitting DB)
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' })
  }

  // 3. Password match check
  if (password !== cpassword) {
    return res.status(400).json({ error: 'Passwords do not match.' })
  }

  try {
    // 4. Duplicate email check
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }

    // 5. Hash password and create user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await User.create({ name, email, password: hash })

    const token = createToken(user._id)

    // Return user without password
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    // Mongoose duplicate key error (race condition fallback)
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }
    // Mongoose validation error (e.g. invalid email format)
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map(e => e.message).join(', ')
      return res.status(400).json({ error: msg })
    }
    console.error('Register error:', error)
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }
}

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body

  // 1. Validate fields present
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    // 2. Find user (case-insensitive via schema lowercase:true)
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // 3. Compare password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = createToken(user._id)

    // Return user without password
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
}

module.exports = { registerUser, loginUser }