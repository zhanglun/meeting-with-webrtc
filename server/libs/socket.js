exports.handleMessage = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  io.on('message', (message) => {
    console.log(message);
  })
}