const path = require("path");
const http = require("http");
const express = require("express");
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
// const bodyParser= require("body-parser");
const moment = require('moment');

const app = express();
const server= http.createServer(app);
const io= socketio(server);

const PORT = 3000 || process.env.port
app.use(express.static('public'));

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
  id:Number,
  name:String
});
clientSchema.plugin(findOrCreate);
const messageSchema = new mongoose.Schema({
  time:String,
  message:String,
  room:String,
  name:clientSchema
});

const Client=  mongoose.model("Client", clientSchema);
const Message= new mongoose.model("Message", messageSchema);



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


