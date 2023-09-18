const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { query, validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")

const JWT_SECRET = "sflkfjs9238sfsdklfs_skdfj@";

//  ROUTE 1: Create a user using: POST  '/api/auth/createuser' no login required
router.post('/createuser',[
    body('name',"enter a valid name").isLength({min:3}),
    body('email', "enter a valid email").isEmail(),
    body('password',"password must be atleat 5 characters long").isLength({min:5})
], async (req,res)=>{
    const error = validationResult(req)                         //check all the fields are valid.
    if(!error.isEmpty()){
        success=false;
        return res.status(400).json({success,error:error.array()})
    }

    try{
        let user = await User.findOne({email:req.body.email});   //check if a user already exists
        if(user){
            success=false;
            return res.status(400).json({success,error:"Sorry a user with this email already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password,salt);
        
        // create a new user
        user = await User.create({ 
            name:req.body.name,
            email:req.body.email,
            password: secPass
        });

        const data = {
            user:{
                id:user.id
            }
        }

        const authtoken = jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authtoken});
    
    }catch(error){                  //catch error if something goes wrong with the database.
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
    //check whether the user with this email already exists
    
    // .then(user => res.json(user)).catch((error)=>{console.log(error)
    // res.json({"error":"This email exists already",message:error.message})})
});

// ROUTE 2: Create a user using: POST  '/api/auth/login' no login required

router.post("/login",[
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists()
], async (req, res)=>{
    const error =  validationResult(req);

    //If there are error, return bad request and the errors
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }

    const {email, password} = req.body;

    try{
        let user = await User.findOne({email});

        if(!user){
            success = false;
           return res.status(400).json({success, error:"Please enter the correct login details"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
           return res.status(400).json({success, error:"Please enter the correct login details"});
        }

        const data = {
            user:{
                id:user.id
            }
        }

        const authtoken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authtoken});

    }catch(error){
        console.log(error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
})


// ROUTE 3: Get loggedin user details using: POST  '/api/auth/getuser'login required
router.post("/getuser", fetchuser,[
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists()
], async (req, res)=>{
try{
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
}catch(error){
    console.log(error.message);
    res.status(500).send("Internal Server Error");
}
})

module.exports = router;