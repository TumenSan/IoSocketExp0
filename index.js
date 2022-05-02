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

io.on('connection', (socket) => {
    socket.on('create', function(room) {
      socket.join("room-"+roomno);//
      //Send this event to everyone in the room.
      io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
    });

    console.log('A user ' + socket.id + ' connected');
    ++clients;
    io.sockets.emit('clients check',{ description: clients + ' clients connected!'});
    //socket.emit('clients check', clients);

    socket.on('chat message', msg => {
      io.emit('chat message', msg);
      console.log(clients);
    });

    socket.on('chat message2', msg => {
      io.emit('chat message2', msg);
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