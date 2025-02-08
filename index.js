// index.js

// Importing required modules
const express = require('express'); // Express framework for server handling
const http = require('http');        // HTTP module to create the server
const { Server } = require('socket.io'); // Socket.io for real-time communication

// Initializing Express app and HTTP server
const app = express(); 
const server = http.createServer(app); // Creating HTTP server using Express
const io = new Server(server);         // Initializing Socket.io with the server

// Serving static files from the 'public' directory
app.use(express.static('public'));

// Handling WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected'); // Log when a new user connects

    // Handle joining a room
    socket.on('joinRoom', (room) => { // Event for joining a chat room
        socket.join(room);            // Add user to the specified room
        console.log(`User joined room: ${room}`);
        socket.to(room).emit('message', 'A new user has joined the room.'); // Notify others in the room
    });

    // Handle chat messages
    socket.on('chatMessage', ({ room, message }) => { // Listen for chat messages
        io.to(room).emit('message', message);         // Send message to all users in the room
    });

    // Handle user disconnection
    socket.on('disconnect', () => { // Event triggered when a user disconnects
        console.log('A user disconnected'); // Log user disconnection
    });
});

// Starting the server and listening on IP and port
server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://192.168.89.69:3000'); // Log the server URL
});
