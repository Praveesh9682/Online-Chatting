// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (adjust for production security)
        methods: ['GET', 'POST']
    }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle joining a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        socket.to(room).emit('message', 'A new user has joined the room.');

        // Store room info in socket for tracking on disconnect
        socket.room = room;
    });

    // Handle chat messages
    socket.on('chatMessage', ({ room, message }) => {
        const sanitizedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Basic sanitization
        io.to(room).emit('message', sanitizedMessage);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        if (socket.room) {
            socket.to(socket.room).emit('message', 'A user has left the room.');
        }
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000; // Use Vercel's dynamic port or default to 3000

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
