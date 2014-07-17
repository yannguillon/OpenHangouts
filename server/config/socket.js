'use strict';

/**
 * Module dependencies.
 */
var
    mean = require('meanio'),
    appPath = process.cwd(),
    util = require('meanio/lib/util'),
    fs = require('fs'),
    Grid = require('gridfs-stream');

module.exports = function(socket) {

    mean.events.on('modulesFound', function() {

        function bootstrapRoutesSocket() {
            console.log()
            util.walk(appPath + '/server/routes/socket', 'socket', '', function(path) {
                require(path)(socket);
            });
        }

        bootstrapRoutesSocket();
    });
};
