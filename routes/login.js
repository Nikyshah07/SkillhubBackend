const express=require('express');
const {User}=require('../models/User')
const router=express.Router()
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken")
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    try{
    if(!user)
    {
        return res.status(400).json({success:false,message:"User does not exist"})
    }
    const isMatch = await bcrypt.compare(password, user.password);
    
    
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Incorrect password." });
            }
            const token = jwt.sign(
                { userId: user._id },
                "abcde"
                
            );
            console.log(user._id);
            console.log(user.name)
    //         user.token=token;
    // await user.save()
    
    return res.status(200).json({success:true,message:"Login successfully...",token,user:user})
}catch(error)
{
    return res.status(401).json({ success: false, message: "Server error during login" });

}
})

module.exports=router