// Server initialization
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Route to public folder
app.use(express.static(__dirname + '/public'));

// Connection to the socket
io.on('connection', (socket) => {
  console.log('a user connected');

  // Message listening and emit to clients
  socket.on('chat-message', (msg) => {
    io.emit('chat-message', msg);
  });

  // Deconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Listening to the port
server.listen(3000, () => {
  console.log('listening on *:3000');
});