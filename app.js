// all modules
"use strict"
 const express = require("express")
const path = require("path")
const passport = require('passport')
const mongoose = require('mongoose');
const session = require('express-session')
const ArticleRouter = require("./Router/article")(express)
const UserRouter = require("./Router/user")(express)
 const databaseConfig = require('./config/database')

mongoose.connect(databaseConfig['database'],{useNewUrlParser:true,useUnifiedTopology:true});


// app init
const app = express(); 

// pug view  engin being in use
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'pug')




// session cookies
app.use(session({
  secret: 'keyboard cat', 
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))






// initialize the passport
 require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

// set globl vars that assigned logged in user obj;
app.get('*',function (req,res,next) {
       res.locals.user = req.user || null;
      //  res.locals.username = typeof(req.user.name) == 'undefined' ? null : req.user.name
  next()
  })


// express message
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

//  db connection open
db.on("open", console.log.bind(console,'connected to mongo client') )


 //  serving all the static 
 app.use(express.static(path. join(__dirname,'public'))) ;




// call the article route
app.use('/',  ArticleRouter ) 


// call the user route
app.use('/user',  UserRouter ) 









// specify port
const PORT = process.env.PORT | 8000;;
app.listen(PORT, function (e) { console.log(`server running on ${PORT}`) })
