const router = require("express").Router();
const User = require("../models/User");
const  List  = require("../models/List");
const CryptoJS = require("crypto-js");
const verifyToken = require("../verifyToken");


////////////////////////////////////////////////////////////////////
//It bascially contains lists of movies and series based on genre//
///////////////////////////////////////////////////////////////////

//ADD LIST
router.post("/", verifyToken, async(req,res) => {
    if(req.user.isAdmin){
        const newList = new List(req.body);
        try{
            const savedlist = await newList.save();
            res.status(201).json(savedlist);
        } catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("You are not allowed!")
    }
})

//DELETE LIST
router.delete("/:id", verifyToken, async(req,res) => {
    if(req.user.isAdmin){
        try{
            await List.findByIdAndDelete(req.params.id);
            res.status(201).json("The list has been deleted");
        } catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("You are not allowed!")
    }
})

//GET LIST
router.get("/",verifyToken, async(req,res)=>{
    const typeQuery = req.query.type; 
    const genreQuery = req.query.genre;
    let list = [];

    try{
        if(typeQuery){               //Here we are aggregating all the movies having specific type and genre and then we are aggregating them.
            if(genreQuery){
                list = await List.aggregate([
                    {$sample : { size: 10}},
                    {$match : { type:typeQuery, genre:genreQuery}}
                ])
            }
            else{
                list = await List.aggregate([
                    {$sample : { size: 10}},
                    {$match : { type: typeQuery}}
                ]);
            }
        }
        else{
            list = await List.aggregate([{ $sample: { size: 10} }]) //If we are not writing type in the query then it will simply aggregate 10 random movies or series.
        }

        res.status(201).json(list);
    }
    catch(err){
        res.status(500).json(err)
    }
    
})





module.exports = router;