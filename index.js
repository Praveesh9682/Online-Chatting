// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle joining a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        socket.to(room).emit('message', 'A new user has joined the room.');
    });

    // Handle chat messages
    socket.on('chatMessage', ({ room, message }) => {
        io.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Prevent form submission from refreshing the page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chat App</title>
        </head>
        <body>
            <form id="form">
                <input id="input" autocomplete="off" /><button>Send</button>
            </form>
            <ul id="messages"></ul>

            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io();

                document.getElementById('form').addEventListener('submit', function(event) {
                    event.preventDefault(); // Prevents page refresh
                    const message = document.getElementById('input').value;
                    if (message.trim() !== '') {
                        socket.emit('chatMessage', { room: 'default', message });
                        document.getElementById('input').value = '';
                    }
                });

                socket.on('message', function(msg) {
                    const li = document.createElement('li');
                    li.textContent = msg;
                    document.getElementById('messages').appendChild(li);
                });
            </script>
        </body>
        </html>
    `);
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://192.168.89.69:3000');
});

