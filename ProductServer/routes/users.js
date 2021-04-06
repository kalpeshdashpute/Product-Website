var express = require('express');
const Contact= require('../models/contacts');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var router = express.Router();



/* GET users listing. */
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



router.post('/contact',(req, res, next)=> {
  let newContact = new Contact({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    message:req.body.message
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


router.delete('/contact/:id', (req, res, next)=> {
  Contact.deleteOne({_id:req.params.id},function(err,result){
    if(err)
    {
      res.json(err);
    }
    else{
      res.json(result);
    }
  })
});

router.post("/login", (req, res, next) => {
  let fetchedUser;

  Contact.findOne({email:req.body.email}).then(user=>{
    if(!user){
      return res.status(401).json({
        message: "Auth failed no such user"
      })
    }
    fetchedUser=user;
    return bcrypt.compare(req.body.password, user.password) && fetchedUser.role==='user';
  }).then(result=>{
    console.log(fetchedUser)
    if(!result){
      return res.status(401).json({
        message: "Auth failed inccorect password"
      })
    }
    
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      "secret_this_should_be_longer",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      fetchedUser
    });

  })
  .catch(e=>{
    console.log(e)
  
  })

})
 module.exports = router;
