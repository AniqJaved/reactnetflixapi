const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js");
const verifyToken = require("../verifyToken")
const { json } = require("express");

//UPDATE USER

router.put("/:id", verifyToken ,async (req,res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString();
        }

        try{
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id, 
            {
                $set: req.body,
            },
            {new: true}                 // $set will update the entries in database but will not return the updated entries. new: true will be returing the updated entries.
            );

            res.status(200).json(updatedUser)
        }
        catch(err){
            res.status(500).json(err)
        }
    }

    else{
        res.status(403).json("You can update only your account!");
    }
})


//DELETE USER

router.delete("/:id", verifyToken ,async (req,res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){                     // I think there is no need of this section of code.
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString();
        }

        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted.....")
        }
        catch(err){
            res.status(500).json(err)
        }
    }

    else{
        res.status(403).json("You can delete only your account!");
    }
})


//GET

router.get("/find/:id", async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc; 
        res.status(200).json(info)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET All

router.get("/", verifyToken ,async (req,res)=>{
    const query = req.query.new;  //By query we mean users?new=true
    if(req.user.isAdmin){
        try{
            const users = query ? await User.find().sort({_id:-1}).limit(10) : await User.find(); //sort({_id:-1}) it will sort from last to first and will return the latest data.
            res.status(200).json(users)
        }
        catch(err){
            res.status(500).json(err)
        }
    }

    else{
        res.status(403).json("You are not allowed to see all users!");
    }
})

// GET USER STATS

router.get("/stats", async(req,res)=>{
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1); //Last year

    const monthsArray = [
        "January",
        "Feburary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    try{
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt"},  //This will return 1 for January, 2 for Feburary and so on.... //$month is mongodb  function which will be returning the month in numerics.
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1},  //This will give us the sum of the users in the month above.
                },
            },
        ]);
        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router