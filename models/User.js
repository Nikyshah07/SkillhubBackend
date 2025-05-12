// const mongoose=require('mongoose')
// const userSchema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
   
// })

// const User=mongoose.model('user',userSchema)
// module.exports={User}


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default:null
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  bio: {
    type: String,
    default: null
  },

  city: {
    type: String,
    default: null
  },
  gender:{
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default:null
  },

  teachSkills: {
    type: [String], // array of skills user can teach
    default: []
  },

  learnSkills: {
    type: [String], // array of skills user wants to learn
    default: []
  },
  fcmToken: {
    type:String,
    default:null
  },
  lastTokenUpdate: {
    type: Date,
    default: null
  }
});

const User = mongoose.model('user', userSchema);
module.exports = { User };
