module.exports = (express)=>{

    const bodyParser = require('body-parser')
    const ArticleModel = require('../models/article_model')
    const UserModel = require('../models/user')
    
    const app = express.Router();
    
    // parse the incomming req
    
    // create application/x-www-form-urlencoded parser
    app.use(bodyParser.urlencoded({ extended: true }) )
    app.use(bodyParser.json())
     
    

    // Access control
    function AccessControl(req,res,next) { 
          if (req.isAuthenticated()) {
          return  next()
          } else {
            res.redirect('/user/login');
            req.flash('danger','Access denied')
            // req.flash("danger", "article deleted");
          }
     }



    
    // listing all articles
    app.get("/",function (req,res) {
        // retriiving all artcles from mongo dbg
        ArticleModel.find({}, function (err, articles) { 
       if (err) {
           throw new Error("NO ARTICLES")
     
       }else{
           
         res.render('index', { title: 'list articles', body: articles  } ) 
       }
     
       
    });
    
    
     });
    





      // show articles form to add
    app.get("/articles/add",AccessControl,function (req,res) {
       res.render('add', {  title: 'add  article!' } )
    });
    
    
    
    // add new artcles
    app.post("/articles/add",AccessControl, function (req,res) { 
          
           let  article= new ArticleModel({
               title:req['body']['title'],
               author:req.user._id,
               desc:req['body']['desc'],
             });
             article.save(function (err) {
                     if (err) {
                       console.log(err);return;
                     }else{
                       req.flash("success", "article added");
                       res.redirect('/');
                        
                     }
               });
            
             
    })
    
    
    //  retrive a single article;
    app.get("/article/:article_id",AccessControl,function (req,res) {
      console.log('single article'+req.params);
      
            ArticleModel.findById({_id:req.params.article_id}, function ( err, artcle ) { 
                    if (err) {
                      console.error(err)
                      return;
                    } else {
                      UserModel.findOne({_id:artcle.author}, function (err, user) {
                                  if (err) {
                                    console.log(err);return;
                                  }else
                                  {
                             
                                    res.render('single', { article: artcle , author:user.name } ) 

                                  }
                      })
                      
                    }
             })
     })
    
    
    
     // deleting article
     app.delete('/article/:remove_id',AccessControl,function (req,res) {  
           ArticleModel.deleteOne({_id:req.params.remove_id}, function (err, data) { 
                     if (err) {
                       console.error(err)
                     } else {
                           
                       res.redirect('/') 
                     }
               })
     })
    
    
     // editing article
    app.get('/article/edit/:id',AccessControl,function (req,res) {  
           ArticleModel.findById({_id:req.params.id}, function (err, artcle ) { 
             if (err) {
               console.error(err);return;
             } else {
              UserModel.findOne({_id:artcle.author}, function (err, user) {
                                if (err) {
                                  console.log(err);return;
                                }else
                                {
                                  res.render('update', { title: artcle.title, data: artcle , author:user.name } ) 

                                }
                    })
              //  res.render('update', { title: artcle.title, data: artcle  } ) 
             }
         })
    })
    
    
    // update entriies 
     app.post("/article/update/:update_id",AccessControl,function (req,res) { 
     
       ArticleModel.findByIdAndUpdate(req.params.update_id, {
         title:req['body']['title'],
         author:req.user._id,
         desc:req['body']['desc']
       }, function (err, raw) {  
          if (err) {
                 console.log(err);return;
               }else{
                 req.flash("info", "article updated");
                  res.redirect('/')
               }
       });    
       
    })
    
    
    // removing entry
    app.get('/article/remove/:id',AccessControl,function (req,res) { 
             ArticleModel.findByIdAndRemove(req.params.id, function (err, resp) {
                      if (err) {
                        console.error(err);return;
                      } else {
                        res.redirect('/')
                        req.flash("danger", "article deleted");
                      }
               })
    })






return app;

}