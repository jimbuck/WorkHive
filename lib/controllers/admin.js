
/*
 * GET admin page.
 */

module.exports = {
    controller: function (app) {

        app.get('/admin', function (req, res) {
            res.render('admin', { title: 'Node@home' });
        });

        app.get('/admin/problem', function (req, res) {
            // View the compute function
            res.render('admin', { title: 'Node@home' });
        });

        app.get('/admin/settings', function (req, res) {
            // View the settings
            res.render('admin', { title: 'Node@home' });
        });

        app.get('/admin/dataset', function (req, res) {
            // View the dataset
            res.render('admin', { title: 'Node@home' });
        });
    },
    sockets: function (socket) {

    }
}