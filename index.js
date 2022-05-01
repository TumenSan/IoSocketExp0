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

io.on('connection', (socket) => {
    console.log('A user ' + socket.id + ' connected');
    ++clients;
    socket.emit('clients check', clients);

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

    socket.on('clients check', msg => {
      io.emit('clients check', msg);
    });

    socket.on('disconnect', function () {
      console.log('A user ' + socket.id + ' disconnected');
      --clients;
      socket.emit('clients check', clients);
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