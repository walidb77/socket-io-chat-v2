// New instance of socket.io
const socket = io();

// DOM
const joinContainer = document.getElementById('join-container');
const joinForm = document.getElementById('join-form');
const usernameInput = document.getElementById('username');
const roomSelect = document.getElementById('room-select');
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById("chat-form");
const msgInput = document.getElementById("msg-input");
const messages = document.getElementById("messages");
const roomName = document.getElementById("room-name")
const usersList = document.getElementById("users-list");
const typingText = document.getElementById("typing-text");
chatContainer.style.display = "none";
let username = "";

// Join chat room
joinForm.addEventListener("submit", e => {
  e.preventDefault();
  username = usernameInput.value;
  socket.emit('join-room', {username, room: roomSelect.value})
  joinContainer.style.display = "none"
  chatContainer.style.display = "block";
});

// Emit message to the server
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  if (msgInput.value) {
    socket.emit('chat-message', msgInput.value);
    msgInput.value = '';
    socket.emit("no-typing");
  }
}); 

// User typing
msgInput.addEventListener('input', () => {
  if(msgInput.value) {
    socket.emit("typing");
  } else {
    socket.emit("no-typing")
  }
});

// Reset typing text 
socket.on("no-typing", () => {
  typingText.textContent = "";
  if(msgInput.value) {
    socket.emit("typing");
  } 
});

// Display who is typing
socket.on("typing", username => {
  typingText.textContent = `${username} is typing...`;
});

// Output message to DOM
socket.on('chat-message', data => {
    messages.innerHTML += `<div class="${data.username === username ? "bg-primary ms-auto" : "bg-secondary bg-opacity-25 text-dark"} p-3 mb-3 w-50 rounded">
    <div class="fw-light mb-2">${data.username} - ${data.time}</div>
    ${data.message}
  </div>`;
    messages.scrollTop = messages.scrollHeight;
});

// Output room and users to DOM
socket.on("room-users", data => {
  roomName.textContent = data.room;
  usersList.innerHTML = data.users.map(user => {
    return `<div>${user.username}</div>`
  }).join("");
})