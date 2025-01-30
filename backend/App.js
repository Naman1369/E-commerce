const express=require('express')
const connectDatabase=require('./db/Database')
const ErrorHandler = require('./middleware/error')
const cookieParser=require('cookie-parser')
const bodyParser=require('body-parser')
const app=express()  
const cors=require('cors')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/",express.static("uploads"))
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}))
app.use(cors())

//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({
        path:'backend/config/.env'
    })
}

//Import router
const user=require('./controller/user')
const product=require("./controller/product")

app.use("/api/v2/user",user)
app.use("/api/v2/product",product)

connectDatabase()

app.use(ErrorHandler)

module.exports=app