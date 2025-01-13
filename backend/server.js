if(process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({
        path:'config/.env'
    })
}

const app=require('./App')

//Handling uncaught execptions

process.on("uncaugthExecption",(err)=>{
    console.log(`Erro:${err.message}`)
    console.log(`shutting down the server for handling uncaught execption`)
})



//create server
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})