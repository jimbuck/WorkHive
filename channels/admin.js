/**
 * Admin Channel
 */


module.exports = function (io) {

  console.log('Loading admin sockets...');
  
  var nsp = io.of('/admin');
  nsp.on('connection', function (socket) {
    console.log('Admin connected');
    socket.on('disconnect', function () {
      console.log('Admin disconnected!');
    });
  });
  nsp.emit('hi', 'everyone!');
};
