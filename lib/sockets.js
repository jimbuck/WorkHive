

module.exports = function (socket) {
    require('./controllers/home').sockets(socket);
    require('./controllers/admin').sockets(socket);
}