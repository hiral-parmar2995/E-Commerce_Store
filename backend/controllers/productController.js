const mongoose = require('mongoose')

const Product = require('../models/product')




//get all products
const getAllProducts = async (req, res) => {
  try {
    const Products = await Product.find({}).sort({ createdAt: -1 })
    res.status(200).json(Products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

//get a single product
const getProductById = async (req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error : 'No such Product!'})
    }

    const IdProduct =await Product.findById(id)

    if(!IdProduct)
    {
        return res.status(404).json({error : 'No Product Found!'})
    }

    res.status(200).json(IdProduct)
}

//creat a new product
const createProduct = async (req,res) => { 
    const { name,description,image,price,category,stock } = req.body

    try{
        const newProduct =await Product.create( { name,description,image,price,category,stock })
        res.status(200).json(newProduct)
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({ error: 'Failed to create product' })
    }
}

//update a product
const updateProduct =async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error : 'No such Product'})
    }

    const UpdateProduct = await Product.findOneAndUpdate({_id : id},{...req.body},{returnDocument :'after' , runValidators:true})

    if(!UpdateProduct)
    {
        return res.status(404).json({error : 'No such Product'})
    }

    res.status(200).json(UpdateProduct)
}

//Delete a Prdouct
const deleteProduct = async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: 'No such Product!'})
    }

    const DeleteProduct = await Product.findOneAndDelete({_id:id})

    if(!DeleteProduct)
    {
        return res.status(404).json({error : 'No such Product !'})
    }

    res.status(200).json(DeleteProduct)
}

module.exports={
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
