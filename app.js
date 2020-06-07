const express  = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const app = express();

const MONGODB_URI =
  'URL';

const fileStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'images');
  },
  filename:(req,file,cb)=>{
    cb(null,new Date().toISOString()+'-' + file.originalname);
  }
});

const fileFilter = (req,file,cb)=>{
  if(file.mimetype==='image/png'||
  file.mimetype==='image/jpg' ||
  file.mimetype==='image/jpeg' ){
      cb(null,true);
  }else {
    cb(null,false);
  }
}

//medewere
app.use(bodyParser.json()); //app json data
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')))

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
  next();
})

const feedRouts = require('./routes/feed');
const auth = require('./routes/auth');

app.use('/feed',feedRouts);
app.use('/auth',auth);


app.use((error,req,res,next)=>{
  console.log(error);
  const status  = error.statusCode || 500 ;
  const message = error.message ;
  const data    = error.data ;
  res.status(status).json({message:message,data:data});

});

mongoose
.connect(
  MONGODB_URI,{
      useNewUrlParser: true,useUnifiedTopology: true}
)
  .then(result => {
    const server = app.listen(5000);
    const io     = require('./socket.io/socket').init(server);
    io.on('connection',socket=>{
      console.log("Clint connected");
    })
  })
  .catch(err => {
    console.log(err);
  });
