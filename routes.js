
module.exports = function(app){
  require('./controllers/api')(app);
  require('./controllers/worker')(app);
  require('./controllers/admin')(app);
};
