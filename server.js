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

const app = express();
const server= http.createServer(app);
const io= socketio(server);

const PORT = 3000 || process.env.port
app.use(express.static('public'));


const botName='chat-it bot';
// run socket when user connects
io.on('connection', socket =>{
  socket.on('joinRoom', ({username, room})=>{
    const user = userJoin(socket.id, username, room);

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


