// New instance of socket.io
const socket = io();

// DOM
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

// Emit message to the server
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat-message', input.value);
    input.value = '';
  }
});

// Message listening form the server
socket.on('chat-message', msg => {
    messages.innerHTML += `<li>${msg}</li>`;
    window.scrollTo(0, document.body.scrollHeight);
    messages.scrollTop = messages.scrollHeight;
});