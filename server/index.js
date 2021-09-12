const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const { handleMessage } = require('./libs/socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('../client'));

handleMessage(io);

server.listen(3000, () => {
  console.log('server started at: http://127.0.0.1:3000');
})