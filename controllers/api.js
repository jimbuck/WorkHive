/**
 * API Controller
 */

module.exports = function (app) {

  // Provides access to the live stats and result data.
  
  app.get('/api', function (req, res) {
    res.send('<h1>API</h1>');
  });

};