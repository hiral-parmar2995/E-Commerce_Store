const express = require('express')
const router = express.Router()
const { createOrder, getOrderById, getUserOrders } = require('../controllers/orderController')
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware')

// Create order 
router.post('/', optionalAuth, createOrder)

// Get order by ID
router.get('/:id', getOrderById)

// Get all orders for logged-in user
router.get('/', requireAuth, getUserOrders)

module.exports = router