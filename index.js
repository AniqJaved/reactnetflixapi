const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const movieRoute = require('./routes/movies')
const listsRoute = require('./routes/lists')

//Grabbing port
const port = process.env.PORT || 8800
//Grabbing the enviroment variables
dotenv.config()

//Connecting with mongodb
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("DB Connection Successful")).catch((err)=>console.log(err))


//Express using json format for files
app.use(express.json());


/////////////////////////Router Paths///////////////////////////////////

//Path for auth router file
app.use("/api/auth", authRoute);

//Path for user router file
app.use("/api/users", userRoute);

//Path for user router file
app.use("/api/movies", movieRoute);

//Path for lists router file
app.use("/api/lists", listsRoute);

////////////////////////////////////////////////////////////////////////


app.listen(port,()=>{
    console.log(`Server up at ` + port)
})