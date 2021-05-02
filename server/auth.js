const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const GitHubStrategy = require('passport-github').Strategy;
require('dotenv').config();

module.exports = function (app, myDataBase) {

//this is used for storing user id in 
//so if we go to another page we cal login with just id saved on local machine of client 
  passport.serializeUser((user, done) => {
    // console.log('-----------------------IT GOES TO passport.serializeUser()------------------------------');
    done(null, user._id);
  });

  //this is used for loging in app with session 
  // it looks for users in monogdb users colection and 
  passport.deserializeUser((id, done) => {
    // console.log('-----------------------IT GOES TO passport.deserializeUser()------------------------------');
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => { // v mongodb je id tako shranjen da moramo dodati ObjectID poglej collection users
      if (err) return console.error(err);
      done(null, doc);
    });
  });


  passport.use(new LocalStrategy(
    
    // this function is callled when a user tries to go to route with midelware ->  passport.authenticate('local') that is a /login rote in our case
    //req.body.username and req.body.password are passed from /login route 
    function (username, password, done) {
      myDataBase.findOne({ username: username }, function (err, user) {
        console.log('User: ' + username + ' attempted to log in.');
        //calling done() will make the flow jump back into passport.authenticate route 
        if (err) {  console.log('prislo je do napaka pri iskanju v DB');  return done(err) }

        if (!user) { console.log('uporabnik s taksnim uporbniskim imenom ne obstaja'); return done(null, false) }

        if (!bcrypt.compareSync(password, user.password)) { console.log('nepravilo geslo'); return done(null, false); }
        console.log('uspesno loginan');
        return done(null, user);
      });
    }
  ));


  passport.use(new GitHubStrategy(

      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:4000/auth/github', // tukaj in na githubu moras zamenjati link ko bos hostau nekje drugje aplikacijo
      },


      function (accessToken, refreshToken, profile, cb) { 
        myDataBase.findAndModify(
              { id: profile.id },
              {},
              { $setOnInsert: {
                      id: profile.id,
                      username: profile._json.login,
                      photo: profile.photos[0].value || '',
                      email: Array.isArray(profile.emails) ? profile.emails[0].value : 'No public email',
                      created_on: new Date(),
                      provider: profile.provider || '',
                    }, 
                    $set: { 
                      last_login: new Date(),
                    }, 
                    $inc: {
                      login_count: 1,
                    }, 
              }, 
              { upsert: true, returnOriginal: false },
              (err, doc) => {
                    return cb(null, doc.value);
                  }
            );
      }
    )
  );
};
