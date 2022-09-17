const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")

//REGISTER
router.post("/register", async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString() //So here we are encrypting the password using the SSECRET_KEY as Key which is defined in enviroment variables .env
    })

    try{
        const user = await newUser.save();
        res.status(201).json(user);
    }
    catch(err){
        res.status(500).json(err)
    }
})

//LOGIN
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        !user && res.status(401).json("Wrong password or username!")

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassworrd = bytes.toString(CryptoJS.enc.Utf8);

        originalPassworrd !== req.body.password &&
        res.status(401).json("Wrong password or username!")

        const accessToken = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin},
            process.env.SECRET_KEY,
            { expiresIn: "5d"}
        );

        const { password, ...info} = user._doc; // So here we are using object destructuring in which we are grabbing password and only sending other fields except password in response. _doc is basically all the information retrieved about a single user.

        res.status(200).json({...info, accessToken});
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router