/**
 * Admin Controller
 */

var path = require('path');

var viewsDirectory = path.join(__dirname, '../views/');

module.exports = function (app) {

  app.get('/admin', function (req, res) {
    res.sendFile('socket.html', {root: viewsDirectory});
  });

};