mongoose.connect('mongodb://localhost:27017/contactlist');
mongoose.connection.on('connected',()=>{
  console.log('conncted to mongoDB @27017');
})

mongoose.connection.on('error',(err)=>{
  console.log('error in database'+err);
})

