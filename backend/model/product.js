const mongoose=require('mongoose')

const schema=mongoose.Schema

const productSchema = new schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        default:[]
    },
    price:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true,
        match:[/.+@.+\..+/,"needed valid email"]
    },
    images:{
        type:[String],
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    cart: [
        {
            productid: {
                type: String,
                required: [true, "Please provide the product ID"],
                unique: true,
            },
            quantity: {
                type: Number,
                required: [true, "Please provide the quantity"],
                min: [0, "Quantity cannot be negative"],
            },
        },
    ],
}, {
    timestamps:true
})

module.exports=mongoose.model("Product",productSchema)