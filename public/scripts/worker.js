
var socket = io(location.origin + '/worker');

socket.on('connect', function(){
  alert('Connected to Workers!');
  
  socket.on('work', function(problem){
    
    var fork = (function(data){
      
    }).bind(this);
    
    var done = (function(){
      
    }).bind(this);
    
    problem.action.call(this, problem.data, fork, done)
  });
  
  // ask for work
  // run the function
  // return the result
  // repeat
  
});