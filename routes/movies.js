const router = require("express").Router();
const User = require("../models/User");
const  Movie  = require("../models/Movie");
const CryptoJS = require("crypto-js");
const verifyToken = require("../verifyToken");


//ADD MOVIE
router.post("/", verifyToken, async(req,res) => {
    if(req.user.isAdmin){
        const newMovie = new Movie(req.body);
        try{
            const savedMovie = await newMovie.save();
            res.status(201).json(savedMovie);
        } catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("You are not allowed!")
    }
})

//UPDATE MOVIE

router.put("/:id", verifyToken ,async (req,res)=>{
    if(req.user.isAdmin){
        try{
            const updatedMovie = await Movie.findByIdAndUpdate(
                req.params.id, 
            {
                $set: req.body,
            },
            {new: true}                 // $set will update the entries in database but will not return the updated entries. new: true will be returing the updated entries.
            );

            res.status(200).json(updatedMovie)
        }
        catch(err){
            res.status(500).json(err)
        }
    }

    else{
        res.status(403).json("You not allowed!");
    }
})

//DELETE MOVIE

router.delete("/:id", verifyToken ,async (req,res)=>{
    if(req.user.isAdmin){
        try{
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("The movie has been deleted....")
        }
        catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("You not allowed!");
    }
})


//GET RANDOM

router.get("/random", verifyToken ,async (req,res)=>{    //We are not using admin in this cuz anyone can watch the movie
    const type = req.query.type;
    let movie;
    try{
        if(type === "series"){
            movie = await Movie.aggregate([
                { $match: {isSeries: true}},
                { $sample: { size: 1}}
            ]);
        }
        else{
            movie = await Movie.aggregate([
                { $match: {isSeries: false}},
                { $sample: { size: 1}}
            ]);
        }
 
        res.status(200).json(movie)
    }
    catch(err){
        res.status(500).json(err)
    }

})

//GET MOVIE
router.get("/find/:id", verifyToken, async (req, res) =>{
    try{
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    }
    catch(err){
        res.status(500).json(err);
    }
}); 


//GET ALL MOVIES
router.get("/", verifyToken, async(req,res)=>{
    if(req.user.isAdmin){
        try{
            const movies = await Movie.find();
            res.status(200).json(movies.reverse());
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("You are not allowed!");
    }
})



module.exports = router;