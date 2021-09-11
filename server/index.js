const path = require('path');
const fs = require('fs');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('../client'));

io.on('connection', (socket) => {
  console.log('a user connected');
})

server.listen(3000, () => {
  console.log('server started at: http://127.0.0.1:3000');
})