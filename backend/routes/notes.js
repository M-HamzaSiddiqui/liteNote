const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes")
const { validationResult, body } = require('express-validator');

// ROUTE 1 : GET ALL THE NOTES USING : GET "/api/note/fetchallnotes" .Login required
router.get('/fetchallnotes', fetchuser, async(req,res)=>{
    try{
        const notes = await Notes.find({user:req.user.id});
        res.json(notes);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2 : POST ADD A NEW NOTE USING POST "/api/note/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title',"enter a valid title").isLength({min:3}),
    body('description', "enter a valid description").isLength({min:5})
], async(req,res)=>{
    try{

        const {title, description, tag} = req.body;
    
        const errors = validationResult(req);
        if(!errors.isEmpty()){
           return res.status(400).json({errors:errors.array()});
        }
        const note = new Notes({
            title, description, tag, user:req.user.id
        })
    
        const savedNote = await note.save();
        res.json(savedNote);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 3 :: UPDATING A NOTE

router.put("/updatenote/:id",fetchuser, async(req, res) => {
    let {title, description, tag} = req.body;
    console.log(req.body)
    const newNote = {};
    if(title){
        newNote.title = title;
    }
    if(description){
        newNote.description = description;
    }
    if(tag){
        newNote.tag = tag;
    }

    let note = await Notes.findById(req.params.id);
    if(!note){
        return res.status(400).send("Not found");
    }

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
    res.json({note});
});

//ROUTE 4 :: DELETE NOTE

router.delete("/deletenote/:id",fetchuser,async(req,res) => {
   let note = await Notes.findById(req.params.id)

    if(!note){
        return res.status(400).send("Not found");
    }

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({note});
});

module.exports = router;
