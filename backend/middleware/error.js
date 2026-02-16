const ErrorHandler = require("../utils/ErrorHandler")

module.exports=(err,req,res,next)=>{
    err.statusCode = err.statusCode||500
    err.message=err.message || "Internal Server Error"

    // CastError (e.g. invalid MongoDB ObjectId)
    if(err.name === "CastError"){
        const message = `Resource not found with the id. Invalid ${err.path}`
        err=new ErrorHandler(message,400)
    }

    //Duplicate key error
    if(err.code === 11000){
        const message=`Duplicate key ${Object.keys(err.keyValue)} Entered`
        err=new ErrorHandler(message,400)
    }

    //Wrong jsonwebtoken
    if(err.name === "JsonWebTokenError"){
        const message = `Your token is invalid, please try again!`
        err=new ErrorHandler(message,400)
    }

    //jwt expired
    if(err.name === "TokenExpiredError"){
        const message = `Your token has expired, please login again`
        err=new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}