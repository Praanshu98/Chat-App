const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

let users = [];

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('new user', (username) => {
        socket.username = username;
        users.push(username);
        io.emit('update users', users);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        users = users.filter(user => user !== socket.username);
        io.emit('update users', users);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
