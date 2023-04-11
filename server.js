// Server initialization
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Store users in array
let users = [];

// Return users array
function getUsers(room) {
  return users.filter(user => user.room === room);
}

// Return an user
function getUser(id) {
  return users.find(user => user.id === id);
}

// Route to public folder
app.use(express.static(__dirname + '/public'));

// Connection to the socket
io.on('connection', (socket) => {
  console.log('a user connected');

  // Join room chat
  socket.on("join-room", data => {
    // Add user in users array
    const user = {id: socket.id, username: data.username, room: data.room};
    users.push(user);
    // Add user in a room
    socket.join(user.room);
    io.to(data.room).emit("room-users",{room: data.room, users: getUsers(data.room)})
  });

  // User typing
  socket.on('typing', () => {
    io.to(getUser(socket.id).room).emit("typing", getUser(socket.id).username);
  })
  socket.on('no-typing', () => {
    io.to(getUser(socket.id).room).emit("no-typing");
  })

  // Message listening and emit to clients
  socket.on('chat-message', (message) => {
    const date = new Date();
    let time = date.getHours() + ":" + date.getMinutes();
    io.to(getUser(socket.id).room).emit('chat-message', {username: getUser(socket.id).username, message, time});
  });

  // Deconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
    if(getUser(socket.id)) {
      let room = getUser(socket.id).room;
      // Remove disconnected user 
      users = users.filter(user => user.id !== socket.id);
      io.to(room).emit("room-users",{room, users: getUsers(room)})
    }
  });
});

// Listening to the port
server.listen(3000, () => {
  console.log('listening on *:3000');
});