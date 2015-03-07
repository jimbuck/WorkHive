
module.exports = function(io){
  console.log('Loading sockets...');
  
  require('./channels/worker')(io);
  require('./channels/admin')(io);
};