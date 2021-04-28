const passport = require('passport');
const bcrypt = require('bcrypt');
var cors = require('cors')
const ObjectID = require('mongodb').ObjectID;



module.exports = function (app, myDataBase, onlineUsers,io) {
  var corsOptions = {
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200

  }

  app.use(cors(corsOptions))


  app.use((req,res,next)=>{
    // console.log(res);
    // console.log('incoming call');
    // console.log(req.session);
    next()
  })



 
// when calling this route you user have to send password an username as data
// zato ker se funkcija v auth.js file line 32 pozene in potrebuje password and username as arguments
// passport.authenticate() middleware invokes req.login() automatically !!!  
app.route('/login').post(passport.authenticate('local',{failureRedirect: '/failure'}), (req, res) => {
    let obj ={
      user:res.req.user,
      uspesnost:true,
      socketioId:''
    }
    let obj1 ={
      username:res.req.user.username,
      img:res.req.user.img,
      password:res.req.user.password,
      uspesnost:true,
      socketioId:''
    }
    onlineUsers.insertOne(obj1,(err, doc)=>{
              if(err){
                  console.log('prislo je do napake pri vnasanju uporabnika v DB');
              }else {
                  console.log('uporabnik uspesno vnesen v DB');
              }
    })
    res.send(obj);
  });
  
  app.get('/failure',(req,res)=>{
    res.send(false)
  })

  app.get('/succes',(req,res)=>{
    res.send(true)
  })


  // app.get('/findUser',(req,res)=>{
  //   myDataBase.findOne({ username: req.body.username }, function (err, user) {
  //   }
  // )})

  app.get('/getData',ensureAuthenticated,( req, res) =>{
    // console.log(res.req.user,'\n----------------------<<  this data sent');
    res.send(res.req.user)
  })
  // getSpecificUserData
  app.post('/getSpecificUserData',ensureAuthenticated,( req, res) =>{ 
         
    onlineUsers.findOne({ _id: new ObjectID(req.body.userId) }, function (err, user) {
      if(user){ 
        let obj = {
          username:user.username,
          img:user.img
        }
        res.send(obj)
      } 
      else if (err) { 
            res.send("napaka")
            throw err
      }else{
      res.send('ni najden uporbnik')
      }
    })
  })


  app.get('/isAuthenticated',ensureAuthenticated, (req,res)=>{
    res.send(true)
  })



  app.route('/auth/github').get(passport.authenticate('github'), (req, res) => {    
    // req.session.user_id = req.user.id; // tole nevem ce je potrebno ubistvu tudi nevem kaj naredi neki spremeni session sam nevem kje, pa tudi req.session.user_id je ze enako req.user.id
    onlineUsers.insertOne(res.req.user,(err, doc)=>{
      if(err){
          console.log('prislo je do napake pri vnasanju uporabnika v DB (github login)');
      }else {
          console.log('uporabnik uspesno vnesen v DB');
            }
      })
    res.redirect('http://localhost:3000/user')        
  });


  app.route('/auth/github/callback').get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    req.session.user_id = req.user.id;
    res.redirect('/chat');
  });


  app.route('/onlineUsers').get(ensureAuthenticated, (req, res) => {
    onlineUsers.find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result); 
    })
  });
  
  app.route('/logout').post((req, res) => { 
    let username = req.user.username   //req.logout() izbrise passport object iz req.sessiona 
    io.emit('userDisconected', req.body.userId)

    req.logout(); 

    onlineUsers.findOneAndDelete({"username":username}) 
    .then((deletedUser)=>{
      if(deletedUser){
        console.log(`Successfully deleted user from online users DB.`)
      } else{
        console.log('User who is logingout cant be fined in DB');
      }
    })
    .catch(err=> 
      console.error(`Failed to find and delete document: ${err}`) 
      )
  res.send(false)
});


  app.route('/register').post(
    (req, res, next) => {
      const hash = bcrypt.hashSync(req.body.password, 12);
      myDataBase.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
          next(err);
        } else if (user) {
          console.log('user whit that username already exisist');
          res.send('user whit that username already exisist');
              } else {
                  myDataBase.insertOne({ username: req.body.username, password: hash, img:'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg' }, (err, doc) => {
                            if (err) {
                              console.log('napaka pri heshanju passworda');
                              res.send('napaka pri heshanju passworda');
                            } else {
                              console.log('uporabnik uspesno registriran');
                              next(null, doc.ops[0]);
                            }
          }
         );
        }
      });
    },(req, res)=>{
      res.send(true);  // tukaj lahko dodam kodo da me takoj avtenticira in redirekta na '/profil' neki na foro passport.authenticate('local') v midelwaru
    }
  );




    //nedefinirane strani
  app.use((req, res, next) => {
    res.status(404).type('text').send('ta starn ni definirana err: 404');
  });
  
};


//this checks if user has session on his local maschine if so he is logged in 
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
  // console.log('user is authenticated');
    return next();
  }
  console.log('user is not authenticate');
  res.send(false)
  // res.redirect('/');
}
