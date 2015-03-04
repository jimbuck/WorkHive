
/**
 * Worker Controller
 */

var path = require('path');

var viewsDirectory = path.join(__dirname, '../views/');

module.exports = function(app) {
  
  app.get('/worker', function(req, res){
    res.sendFile('worker.html', {root: viewsDirectory});
  });
  
};