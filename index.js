const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')


//Grabbing port
const port = process.env.PORT || 8800
//Grabbing the enviroment variables
dotenv.config()

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log("DB Connection Successful"))
.catch((err)=>console.log(err))

app.listen(port,()=>{
    console.log(`Server up at ` + port)
})