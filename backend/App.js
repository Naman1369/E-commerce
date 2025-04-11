const express=require('express')
const connectDatabase=require('./db/Database')
const ErrorHandler = require('./middleware/error')
const cookieParser=require('cookie-parser')
const bodyParser=require('body-parser')
const app=express()  
const cors=require('cors')
const path=require('path')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/",express.static("uploads"))
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}))
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true  // Allow credentials (cookies, authorization headers, etc.)
}));

//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({
        path:'backend/config/.env'
    })
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/products', express.static(path.join(__dirname, 'products')));

//Import router
const user=require('./controller/user')
const product=require("./controller/product")
const orders = require('./controller/order')

app.use("/api/v2/user",user)
app.use("/api/v2/product",product)
app.use("/api/v2/orders",orders)

connectDatabase()

app.use(ErrorHandler)

module.exports=app