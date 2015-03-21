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
    
    socket.on('done', function(problem){
      // Store result in DB.
      saveResult(problem).then(function(){
        // Send a new problem.
        sendNewProblem(socket);
      });
    });

    socket.on('fork', function (args) {
      // Add a new problem to the queue.
      addNewProblem(args)
    });
    
    socket.on('disconnect', function(){
      console.log('Worker disconnected!');
    });
    
    // Send a problem
    sendNewProblem(socket);
  });
};

function saveResult(problem){
  // TODO: Save the problem.result to the db.
}

function addNewProblem(args){
  // TODO: Add new problem to the queue...
}

function sendNewProblem(sock) {

  // Grab problem from DB.
  var problem = {}; // TODO: Get next problem from queue.

  // And return to sender.
  sock.emit(problem);
}
