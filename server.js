const express= require('express');
const http = require('http');
const socketio= require('socket.io');


const app = express();
const server= http.createServer(app);
const io= socketio(server);

const PORT = 3000 || process.env.port
app.use(express.static('public'));

// run socket when user connects
io.on('connection', socket =>{
  console.log("New WS connection...");
   
  // message the user when he connects
  socket.emit('message', 'Welcome to cha-it!');

  // brodacast when user connects(for all connected users)
  socket.broadcast.emit('message', 'A user has joined the chat..');

  // brodcast when user disconnects(assecsible for everyone)
  socket.on('disconnect', ()=>{
    io.emit('message', 'A user left the chat..');
  });

  //listen to chatMessage
   socket.on('chatMessage', (msg)=>{
     io.emit("message", msg);
   })
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


