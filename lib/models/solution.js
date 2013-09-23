var resourceful = require('resourceful');

var Solution = resourceful.define('solution', function () {

    this.object('input');
    this.object('output');

    this.parent('problem');

    this.timestamps();
});

Solution.property('IsSolved', 'bool', {
    get: function () {
        return this.properties.Output ? true : false;
    },
    set: function (val) {
        return this.properties.Output ? true : false;
    }
});


module.exports = Solution;