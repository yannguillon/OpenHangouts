/**
 * Created by Quentin on 20/07/14.
 */

'use strict';

module.exports = function(app) {
    // Home route
    var dashboard = require('../controllers/dashboard');

    app.route('/dashboard')
        .get(dashboard.render);

};
