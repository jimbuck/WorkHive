var resourceful = require('resourceful');

var Problem = resourceful.define('problem', function () {   
    
    this.string('name');
    this.string('code');

    this.timestamps();
});

module.exports = Problem;