const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ContactSchema =mongoose.Schema({
  name:{
      type:String,
      required:true
  },
  email:{
      type:String,
      required:true
  },

  password:{
    type:String,
    require:true
},
role:{
type:String,
default:"user",
enum:["user","admin"]
},
  message:{
      type:String,
      require:true
  }
})

ContactSchema.pre('save',async function(next){
  try{
  const salt = await bcrypt.genSalt(11)
  const hashedPassword = await bcrypt.hash(this.password,salt)
  this.password=hashedPassword
  next()
  }  
  catch(error){
  next(error)
  }
  })
const Contact =module.exports=mongoose.model('Contact',ContactSchema);