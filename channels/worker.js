/**
 * Worker Channel
 */

var console = process.console;

module.exports = function (io) {

  console.log('Loading worker sockets...');
  
  var workerSocket = io.of('/worker');
  
  console.dir(workerSocket.on);
  
  workerSocket.on('connect', function (socket) {
    console.log('Worker connected');
    
    socket.on('solution', function(result){
      // Store result in DB.
      sendNewProblem(socket);
    });
    
    socket.on('disconnect', function(){
      console.log('Worker disconnected!');
    });
    
    // Send a problem
    sendNewProblem(socket);
  });
};

function sendNewProblem(sock) {

  // Grab problem from DB.
  var problem = getNewProblem();

  // And return to sender.
  sock.emit(problem);
}

function getNewProblem() {
  return {
    action: (function (done) {


      done();
    })
  }
}


