/**
 * Worker Channel
 */

var console = process.console;

module.exports = function (io) {

  console.log('Loading default sockets...');
  
  io.on('connect', function (socket) {
    console.log('Default connected');
    socket.on('disconnect', function () {
      console.log('Default disconnected!');
    });
  });
};
