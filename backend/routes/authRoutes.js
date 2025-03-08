const express =require("express")
const router= express.Router()
const bcrypt = require("bcryptjs")
const {generateToken}=require("../config/jwt")
const User =require("../models/User")
router.post("/signup",async (req,res)=>{
    try{
        const {username,email,password,mobile,role}= req.body
        let existingUser =await User.findOne({email})
        if(existingUser) 
            return res.status(400).json({"message":"User already existed"})
        const hashedPassword=await bcrypt.hash(password, 10)
        const newUser=await User.create({
            username, email, password:hashedPassword,mobile,role
        })
        console.log("signup route", newUser)
        const token=generateToken(newUser._id)
        res.status(201).json({"message":"User created",token,role:newUser.role})
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message":"Internal server error"})
    }
})

router.post("/login",async (req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({"message":"User not found"})
        }
        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({"message":"Passdword incorrect"})
        }
        const token=generateToken(user._id)
        res.status(200).json({"message":"login successful",token,role:user.role})
    }
    catch(err){
        console.log("Error from login",err)
        res.status(500).json({"message":"Internal server error from login route"})
    }
})
module.exports= router