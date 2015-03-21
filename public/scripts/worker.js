;(function(){
  var socket = io(location.origin + '/worker');

  socket.on('connect', function () {
    console.log('Connected as a worker!');

    socket.on('work', function (problem) {
      console.log('Work received!')
      var fork = (function (args) {
        socket.emit('fork', {
          name: problem.name,
          args: args
        });
        console.log('Problem forked!');
      }).bind(this);

      var done = (function (result) {
        problem.result = result;
        socket.emit('done', problem);
        console.log('Done computing!');
      }).bind(this);

      problem.action.call(this, {
        name: problem.name,
        args: problem.args,
        fork: fork,
        done: done
      });
    });
  });
})();