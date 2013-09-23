

module.exports = function (app) {
    require('./controllers/home').controller(app);
    require('./controllers/admin').controller(app);
};