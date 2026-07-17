const mongoose = require('mongoose')
const Order = require('../models/order')

const createOrder = async (req, res) => {
  const { items, totalPrice, address, status } = req.body

  try {
    // items from frontend: [{ product: id, quantity: n }]
    const newOrder = await Order.create({
      user: req.user ? req.user._id : undefined,
      items,
      totalPrice,
      address,
      status
    })
    res.status(201).json(newOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create order' })
  }
}

const getOrderById = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Order not found' })
  }

  const order = await Order.findById(id).populate('items.product').populate('user', 'name email')

  if (!order) {
    return res.status(404).json({ error: 'Order not found' })
  }

  res.status(200).json(order)
}

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { createOrder, getOrderById, getUserOrders }