
var Problem = require('../models/problem.js');
var Solution = require('../models/solution.js');

/*
 * GET home page.
 */

module.exports = {
    controller: function (app) {

        // Display current stats
        app.get('/', function (req, res) {
            res.render('index', { title: 'Node@home' });
        });

        // Creates
        app.get('/client', function (req, res) {

            res.render('client', {
                compute: 'function(){alert("Look at me!"); return 10;}'
            });
        });

        // Initiates the computing...
        app.get('/compute', function (req, res) {
            //files.serve('index.html', req, res);
        });

    },
    sockets: function (socket) {

    }
}