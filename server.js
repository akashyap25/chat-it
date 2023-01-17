require('dotenv').config();
const path = require("path");
const http = require("http");
const express = require("express");
const ejs= require("ejs");
const { urlencoded } = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const bodyParser= require("body-parser");
const moment = require('moment');

//login-authentication

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
var GoogleStrategy = require('passport-google-oauth20').Strategy;



const app = express();
const server= http.createServer(app);
const io= socketio(server);

const PORT = 3000 || process.env.port
app.use(express.static('public'));

app.set('view engine', 'ejs');

//login-authentication
app.use(session({
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
// mongodb atlas connection 

const url = "mongodb+srv://admin:Patanhi123@cluster0.oiszp5w.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, {
  useUnifiedTopology:true,
});

const client = new MongoClient(url);
 
 // The database to use
 const dbName = "test";
 const db = client.db(dbName);
                      
 

mongoose.set('strictQuery', true);

const clientSchema = new mongoose.Schema({
  name:String,
  username:String,
  password:String,
  googleId: String
});

const messageSchema = new mongoose.Schema({
  time:String,
  message:String,
  room:String,
  name:clientSchema
});
clientSchema.plugin(passportLocalMongoose);
clientSchema.plugin(findOrCreate);

const Client=  mongoose.model("Client", clientSchema);
const Message= new mongoose.model("Message", messageSchema);

passport.use(Client.createStrategy());
passport.serializeUser(function(client, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: client.id,
      username: client.username,
      picture: client.picture
    });
  });
});

passport.deserializeUser(function(client, cb) {
  process.nextTick(function() {
    return cb(null, client);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);

  Client.findOrCreate({ googleId: profile.id }, function (err, client) {
    return cb(err, client);
  });
}
));

app.get("/", function(req,res){
  res.render("home");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile"] }));

  app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/chat');
  });

app.get("/login", function(req,res){
    res.render("login");
  });

  app.get("/register", function(req,res){
    res.render("register");
  });



const botName='chat-it bot';
// run socket when user connects
io.on('connection', socket =>{
  socket.on('joinRoom', ({username, room})=>{
    const user = userJoin(socket.id, username, room);
    const client= new Client({
      name:user.username
     });
     const col = db.collection("clients");
      col.insertOne(client);
      socket.join(user.room);

     // welcome a user 
  socket.emit('message', formatMessage(botName, `Welcome to cha-it! ${user.username}`));

  // brodacast when user connects(for all connected users)
  socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} joined the chat..`));

//send users and room info
io.to(user.room).emit('roomUsers', {
  room:user.room,
  users: getRoomUsers(user.room)
});

  });

  
   
  
  //listen to chatMessage
   socket.on('chatMessage', (msg)=>{
    const user= getCurrentUser(socket.id);
     io.to(user.room).emit('message',  formatMessage(user.username, msg));
     const message= new Message({
        time: moment().format('h:mm a'),
        message:msg,
        room:user.room,
        name:"Anurag"
     });
     const col = db.collection("messages");
      col.insertOne(message);
   });

// brodcast when user disconnects(assecsible for everyone)
socket.on('disconnect', ()=>{
  const user= userLeave(socket.id);
  if(user){
    io.to(user.room).emit
    ('message', formatMessage(botName,`${user.username} left the chat..`));

    //send users and room info
  io.to(user.room).emit('roomUsers', {
    room:user.room,
    users: getRoomUsers(user.room)
  });
  }
});
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


