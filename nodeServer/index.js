const { urlencoded } = require('express');
const express = require('express');
const app = express();
const http = require('http');
const path = require('path'); 
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users={};

const staticfile=path.join(__dirname,'../public');
app.use(express.static(staticfile))

app.get('/', (req, res) => {
 
  res.sendFile(path.join(process.cwd(),'../index.html'));
});


io.on('connection',socket=>{
 // console.log('user connect')
    //if any new user join,let other users connected to the server know!
    socket.on('new-user-joined',name=>{
      console.log('New user',name)
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });

    //if someone send a message,broadcast it to other people
      socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name: users[socket.id]})
      })
      
      //if someone leave the chat, let other know 
      socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
      })


})

server.listen(3000, () => {
  console.log('listening on *:3000');
});