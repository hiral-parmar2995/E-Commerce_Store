const express = require('express');
const mongoose = require('mongoose');

const { registerUser , loginUser } = require ('../controllers/authController.js');


const router = express.Router();

// Register User
router.post('/register', registerUser)

router.post('/login',loginUser)

module.exports = router;