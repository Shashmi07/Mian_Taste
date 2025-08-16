module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Chef connected:', socket.id);

    // Join chef room for targeted updates
    socket.join('kitchen');

    socket.on('disconnect', () => {
      console.log('Chef disconnected:', socket.id);
    });
  });
};