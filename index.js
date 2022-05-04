const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/*
io.on('connection', (socket) => {
  //console.log('a user connected'); //
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});
*/

var clients = 0;
var roomno = 1;
//var clientsInRoom = [];
var clientsInRoom1 = 0;
var clientsInRoom2 = 0;

var userId = [];

users = [];
connections = [];

io.on('connection', async (socket) => {
    //userId.push(await fetchUserId(socket));
    //console.log(userId);
    console.log(socket.id);
    connections.push(socket.id);
    console.log("! " + connections + " : " + connections.length);
    
    socket.on('create', function(room) {
      if (clientsInRoom1 > 1){
        roomno = 2;
      }
      socket.join("room-"+roomno);//
      if (roomno == 1){
        ++clientsInRoom1;
      } else {
        ++clientsInRoom2
      }
      
      var userName = room.name;
      userId.push(room.userId);
      

      //Send this event to everyone in the room.
      io.sockets.in("room-"+roomno).emit('connectToRoom', {description:"You are in room no. "+roomno, usId: socket.id});
    });

    console.log('A user ' + socket.id + ' connected');
    ++clients;
    io.sockets.emit('clients check',{ description: clients + ' clients connected!'});
    //socket.emit('clients check', clients);

    /*
    socket.on('chat message', msg => {
      io.emit('chat message', msg);
      console.log(clients);
    });
    */
    socket.on('chat message', function(msg, socket){
      console.log(socket);
      //console.log(socket.id);
      io.emit('chat message', msg);
      console.log(clients);
    });

    socket.on('chat message2', msg => {
      io.in("room-"+roomno).emit('chat message2', msg);
    });

    /*
    socket.on('clients check', msg => {
      io.emit('clients check', {description: clients + ' clients connected!'});
    });
    */

    /* //
    socket.on('clients check', msg => {
      io.emit('clients check', msg);
    });
    */

    socket.on('disconnect', function () {
      connections.splice(connections.indexOf(socket), 1);
      console.log("123 " + connections + " 123" + connections.length);
      console.log('A user ' + socket.id + ' disconnected');
      --clients;
      io.sockets.emit('clients check',{ description: clients + ' clients connected!'});
      //socket.emit('clients check', clients);
    });

   /*
    socket.on("chat message", (anotherSocketId, msg) => {
        console.log(socket.id);
        io.emit('chat message', msg);
        //socket.to(anotherSocketId).emit("chat message", socket.id, msg);//
    });
    */

  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});