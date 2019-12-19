// const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./../models/user')
const bcrypt = require('bcrypt')
const dbconfig = require('./database') 


module.exports= function (passport) { 

     passport.use(new LocalStrategy(  {
        usernameField: 'email',
        passwordField: 'password'
      }, 
         function (email,password,done) {
            //  finnd out emaiil first
             User.findOne({email:email}, function (err, user) { 
                      if(err){return done(err)}
                      // email not found
                      if(!user){return done(null,false,{'message':'Invalid email'})}
                      // check user password
                      bcrypt.compare(password,user['password'], function (err, isMatched) {
                                 if (err){return done(err)};
                                 if (isMatched) {
                                    return done(null, user);   
                                 } else {
                                     
                                     return done(null, false, { message: 'Incorrect password.' });
                                 }

                        } )
              }  );
           }
     ));


     passport.serializeUser(function(user, done) {
        done(null, user._id);
      });
      
      passport.deserializeUser(function(_id, done) {
        User.findById(_id, function(err, user) {
          done(err, user);
        });
      });

 }