const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authorization.split(' ')[1]

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(id).select('_id name email')
    next()
  } catch (error) {
    res.status(401).json({ error: 'Request is not authorized' })
  }
}

// Optional auth - attaches user if token present, but doesn't block
const optionalAuth = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.split(' ')[1]
      const { id } = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(id).select('_id name email')
    } catch (_) {}
  }
  next()
}

module.exports = { requireAuth, optionalAuth }