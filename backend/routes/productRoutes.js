const express = require('express');
const mongoose = require('mongoose');

const { createProduct, getAllProducts ,getProductById ,updateProduct ,deleteProduct} = require('../controllers/productController')
const router = express.Router();



router.post('/',createProduct)


router.get('/', getAllProducts)


router.get('/:id',getProductById)

router.patch('/:id',updateProduct)

router.delete('/:id',deleteProduct)
   


module.exports = router;


