module.exports = (express) => {
    
    const bodyParser = require('body-parser')
    const UserModel = require('../models/user')
    const bcrypt = require('bcrypt'); 
 const passport=require('passport')
 
 







 const router = express.Router();

 

    // parse the incomming req
    router.use(bodyParser.urlencoded({ extended: true }) )
    router.use(bodyParser.json())
  
 



// create user form
 router.get('/registration', function (req,res) {  
       res.render('user_create');
 })



// create user
router.post('/registration', function (req,res) {  
   const {name,email,password,cpassword}= req.body;
   
   const newUser =new UserModel({
       name:name,
       email:email,
       password:password
   })

   bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
                   if (err) {
                       console.log( err  );
                       
                   } else {
                        newUser.password=hash;
                        newUser.save(function (err,data) {
                                if (err) {
                                    console.log(err);
                                    return;
                                } else {
                                    res.redirect('/user/login');
                                    req.flash('success','user  registered')
                                }
                                })
                   }
        });
      });


      


})


 

router.get('/login', function (req,res) { 
         res.render('login')
 })
 
router.post('/login',function (req,res,next) {  
    passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true }) (req,res,next);
    
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success','successfully logged out')
    res.redirect('/');
  });







    return router;  

}