'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    logger = require('mean-logger'),
    https = require('https');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./server/config/config');
var db = mongoose.connect(config.db);
var conn = mongoose.connection;
conn.on('error', console.log.bind(console, '**Could not connect to MongoDB. Please ensure mongod is running and restart MEAN app.**\n'));

// Bootstrap Models, Dependencies, Routes and the app as an express app
var boot = require('./server/config/system/bootstrap')(passport, db);
var app = boot.app;
var socket = boot.socket;

// Start the app by listening on <port>, optional hostname
conn.once('open', function() {

//    app.https({key: config.key, cert: config.cert}).listen(config.port, config.hostname);
    var s = https.createServer({key: config.key, cert: config.cert}, app).listen(config.port, config.hostname);
    socket.listen(s);
    console.log('MEAN app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');
//    io.on('connection', function(socket) {
//        console.log('socket IO connected');
//
//        socket.on('message', function(message) {
//            io.sockets.emit('message', message);
//        });
//    });

    // Initializing logger
    logger.init(app, passport, mongoose);
});

// Expose app
exports = module.exports = app;
