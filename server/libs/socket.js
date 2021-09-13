exports.handleMessage = (io) => {
  const ROOMID = 'zhanglun-test';

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', () => {
      socket.join(ROOMID);
    });

    socket.on('leave', () => {
      socket.to(ROOMID).emit('leaved');
      socket.leave(ROOMID);
    });

    socket.on('message', (message) => {
      const msg = JSON.parse(message);
      socket.to(ROOMID).emit('message', message);
    })
  });

}