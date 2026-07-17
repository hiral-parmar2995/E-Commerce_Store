const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String
    },
    description:{
        type:String,
        default:'No Description Provided'
    },
    
    category:{
        type:String
    },
    stock:{
        type:Number,
        required: true,
        default: 0,
        min: [0,'Stock Cannot be Negative']
        
    }

},{timestamps : true})

module.exports = mongoose.model('Product', productSchema)