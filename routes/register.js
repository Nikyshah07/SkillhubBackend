const express=require('express');
const {User} = require('../models/User');
const router=express.Router()
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken")
router.post('/register',async(req,res)=>{
    const {email,password,confirmPassword}=req.body;
    const user=await User.findOne({email});
    
    try{
        if(user)
            {
                return res.status(401).json({success:false,message:"User already exist"})
            }
            if(password!==confirmPassword)
            {
                return res.status(401).json({success:false,message:"Password and confirmPassword should be same"})
            }
     const hashedPassword=await bcrypt.hash(password,10)
    const newUser=new User({email,password:hashedPassword})
    const savedUser=await newUser.save()
     const token = jwt.sign(
                { userId: savedUser._id },
                "abcde",
                
            );
            newUser.token=token;
            await newUser.save()
            console.log(savedUser.name)
            console.log(savedUser)
    return res.status(200).json({success:true,message:"register successfully...",user:savedUser,token})
    }
    catch(error)
    {
        return res.status(401).json({success:false,message: 'Server error during registration',
            error: error.message})  
    }
})

module.exports=router