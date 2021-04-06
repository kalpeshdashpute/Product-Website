var express = require('express');
const Contact= require('../models/contacts');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var router = express.Router();


function verifyToken(req,res,next){
  if(!req.headers.authorization){
    return res.status(401).send('unathorized request');
  }
  let tokens=req.headers.authorization.split(' ')[1]
  if(tokens===null){
    return res.status(401).send('unauthorized request');
  }
  let payload=jwt.verify(tokens,'secretKey');
  if(!payload){
    return res.status(401).send('unauthorized request');
  }
  req.userId=payload.subject
  next()
  }

router.get('/contacts', function(req, res, next) {
    Contact.find(function(err,contact){
      if(err)
      {
        res.send(err);
      }
      else{
        res.json(contact)
      }
    })
    
  });
  
  
router.post('/adminRegister',(req, res, next)=> {
    let newContact = new Contact({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      role:req.body.role
    })
  
    newContact.save((err,contact)=>{
      if(err){
        res.json('failed to add contact')
      }
      else{
        res.json('contact added successfully');
      }
    });
  });

router.post("/adminLogin",  (req, res, next) => {
    let fetchedUser;
  
    Contact.findOne({email:req.body.email,role:req.body.role}).then(user=>{
      if(!user){
        return res.status(401).json({
          message: "Auth failed no such user"
        })
      }
      fetchedUser=user;
      return bcrypt.compare(req.body.password, user.password);
    }).then(result=>{
      console.log(fetchedUser)
      
      if(!result){
        return res.status(401).json({
          message: "Auth failed inccorect password"
        })
      }
    
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id,role:fetchedUser.role },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        role:fetchedUser.role
      });
    })
    .catch(e=>{
      console.log(e)
    
    })
  })
  module.exports = router;