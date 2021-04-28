require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const auth = require('./auth.js');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ url: URI }); // starting up mongodb // this db used for storing session
const PORT = process.env.PORT || 4000;
const socketAuth = require('socketio-auth');
const ObjectID = require('mongodb').ObjectID;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }, 
  key: 'express.sid',
  store: store  //mongodb line 16 used for storing session
}));


app.use(passport.initialize());
app.use(passport.session());

io.use(
   passportSocketIo.authorize({
     cookieParser: cookieParser,
     key: 'express.sid',
     secret: process.env.SESSION_SECRET,
     store: store,
     success: onAuthorizeSuccess,
     fail: onAuthorizeFail 
   })
);

let clienstSockets

myDB(async (client) => {
  const myDataBase = await client.db('database').collection('users'); //creating collection for database creacted in connection.js
  const onlineUsers = await client.db('database').collection('online');



//----------------------user verification form socket.io-------------------------------

async function verifyUser (token) {
  return new Promise((resolve, reject) => {
    // setTimeout to mock a cache or database call
    setTimeout(() => {
      // this information should come from your cache or database
      let user;
      onlineUsers.findOne({"username":token}, function(err, result) {
          if (result == null){
            return reject('USER_NOT_FOUND');
          }else if(result){

            return resolve(token);
          }
        })
    }, 200);
  });
}


socketAuth(io, {
  authenticate: async (socket, data, callback) => {
    const { token } = data;
    
    console.log('-------------authenticating socket.io---------------');
    console.log(token);
    console.log('-------------authenticating socket.io---------------');
    
    try {
      const user = await verifyUser(token);
        socket.user = user;
        
        onlineUsers.findAndModify( 
          { username: token }, 
          {},
          { 
            $set: { 
              socketioId: socket.id,
            }, 
          }, 
          { upsert: true, returnOriginal: false },
          (err, doc) => {
            if (err){ throw err}
            console.log('socketio value updated');
          }
      );
      
      return callback(null, true);
  } catch (e) {
      console.log(`Socket ${socket.id} unauthorized.`);
      return callback({ message: 'UNAUTHORIZED' });
  }
},
postAuthenticate: (socket) => {
  console.log(`Socket ${socket.id} authenticated sucessfuly.`);
},
disconnect: (socket) => {
  console.log(`Socket ${socket.id} disconnected.`);
},
})
//------------------------------------------------------------------------



  routes(app, myDataBase, onlineUsers, io);
  auth(app, myDataBase);

  let currentUsers = 0;
  

  io.on('connection', (socket) => {
    console.log('-------------------');
        console.log('A user has connected');
        console.log('-------------------\n');
        ++currentUsers; 

        // console.info(socket.user,"---------------------socket.handshake.auth----------------------------------------");
        io.emit('user', {
          name: socket.request.user.username,
          img: socket.request.user.img || socket.request.user.photo,
          currentUsers,
          connected: true
        });

        socket.on('dsc',(res)=>{
          console.log('uipdfsuiphsdfghjksdfghjosdfghjfghjoodfgjikoadfgjiodfghjijnkcvbipertyhusdgklhjn');
          // socket.broadcast.emit('dsc', res)
        })

        // privateChatMsg
        socket.on('privateChatMsg', (obj) =>{
          let {sporocilo, posiljatelj, sprejemnik, posiljateljId } =obj
          //get socket id of sprejemnik
          let sprejemnikIzDB
          onlineUsers.findOne({ _id: new ObjectID(sprejemnik) }, (err, result) => { // v mongodb je id tako shranjen da moramo dodati ObjectID poglej collection users
            if (err) return console.error(err);
            try{
            io.to(result.socketioId).emit('privateChatMsg', obj) 
            }catch(e){
              console.log(e);
            }
          });

        })

        
        socket.on('chatmessage', (message) =>{
          console.log(message,'<--mesage recived');
          io.emit('chatmessage', {
            name: socket.request.user.username ,
            img: socket.request.user.img || socket.request.user.photo,
            message: message
          }) 
        })

        socket.on('disconnect', () => {
          console.log('A user has disconnected');
          --currentUsers;
          io.emit('user', {
            name: socket.request.user.username,
            img: socket.request.user.img,
            currentUsers, 
            connected: false
          });
        });
  });


}).catch((e) => {
  app.route('/').get((req, res) => {
    console.log('prislo je do napake med nalaganjem beckend kode 89 line');
    res.render('pug');
  }); 
});

function onAuthorizeSuccess(data, accept) {
  // console.log('successful connection to socket.io');

  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error) throw new Error(message);
  console.log('failed connection to socket.io:', message);
  accept(null, false);
}

http.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
