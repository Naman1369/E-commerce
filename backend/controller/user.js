
const express = require("express")
const path = require('path')
const User = require('../model/user')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
const sendMail=require('../utils/sendMails')
const fs = require('fs')
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const {upload} = require('../multer')
const ErrorHandler=require('../utils/errorhandler')

router.post("/create-user",upload.single('file'),catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password}=req.body;
    const userEmail = await User.findOne({email});


    if(userEmail){
        if (req.file) {
            const filepath = path.join(__dirname,'../uploads',req.file.filename)
            try{
                fs.unlinkSync(filepath)
            } catch(err){
                console.log("Error Removing file: ",err)
                return res.status(500).json({message:"Error removing file"})
            }
        }
        return next(new ErrorHandler("User Already Exisits:",400))
    }

    let fileUrl = "";
    if(req.file){
        fileUrl = path.join("uploads",req.file.filename);
    }

    const hashedPassword = await bcrypt.hash(password,10);
    console.log("At create","Password:",password,"Hash:",hashedPassword)

    const user=await User.create({
        name:name,
        email:email,
        password : hashedPassword,
        avatar:{
            public_id:req.file?.filename||"",
            url:fileUrl,
        }
    });
    console.log(user)
    res.status(201).json({message:"User Created Successfully",success:true,user})
}));

router.post('/login', catchAsyncErrors(async(req,res,next)=>{
    console.log('Creating User...')
    const {email,password}=req.body
    if(!email || !password){
        return next(new ErrorHandler("please provide credentials!",400))
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }
    const isPasswordMatched = await bcrypt.compare(password,user.password)
    console.log("At auth","Password:","Hash:",user.password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }
    user.password = undefined 
    res.status(200).json({
        success: true,
        user 
    })
    
}))


module.exports=router;
