/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').
    factory('WebRTC', ['Global', 'mySocket', '$window', '$sce', function (Global, mySocket, $window, $sce) {
        var self = this;
        var SIGNALING_SERVER = '/',
            defaultChannel = 'default-channel';
        self.socket = null;
        var connection = new RTCMultiConnection(defaultChannel);
        var observerCallbacks = [];
        var notifyObservers = function(){
            angular.forEach(observerCallbacks, function(callback){
                callback();
            });
        };

        self.users = [];
        self.myuser = null;
        self.screen = null;
        self.fake_screen = false;

        connection.session = {
            audio: true,
            video: true
        };

        //Clean : check if we need the id variable.
        connection.extra = {
            username: Global.user.username,
            fullname: Global.user.name,
            id: Global.user._id
        };

        self.switchPresenter = function(id) {

        }


        var onMessageCallbacks = {};
        var socketio = io.connect(SIGNALING_SERVER);

        socketio.on('message', function(data) {
            if(data.sender == connection.userid) return;

            if (onMessageCallbacks[data.channel]) {
                onMessageCallbacks[data.channel](data.message);
            };
        });

        connection.openSignalingChannel = function (config) {
            var channel = config.channel || this.channel;
            onMessageCallbacks[channel] = config.onmessage;

            if (config.onopen) setTimeout(config.onopen, 1000);
            return {
                send: function (message) {
                    socketio.emit('message', {
                        sender: connection.userid,
                        username: connection.extra.fullname,
                        channel: channel,
                        message: message
                    });
                },
                channel: channel
            };
        };

//
//        connection.openSignalingChannel = function(config) {
//            var channel = config.channel || defaultChannel;
//            var sender = Global.user._id;
//            io.connect(SIGNALING_SERVER).emit('new-channel', {
//                channel: channel,
//                sender: sender
//            });
//
//            var socket = io.connect(SIGNALING_SERVER + channel);
//            socket.channel = channel;
//            socket.on('connect', function() {
//                if (config.callback) config.callback(socket);
//            });
//
//            socket.on('presenterGiven', function(){
//                console.log("presenter given");
//                if (self.fake_screen === false)
//                {
//                    connection.addStream({    screen: true,
//                        oneway: true})
//                    self.fake_screen = true;
//                }
//                else
//                alert("BLOB - 2x screen");
//            });
//
//
//            socket.send = function(message) {
//                socket.emit('message', {
//                    sender: sender,
//                    data: message
//                });
//            };
//            socket.on('message', config.onmessage);
//            connection.socket = socket;
//            socket.setPresenter = function(){socket.emit('setPresenter', {
//                id: Global.user._id
//            })}
//            connection.socket = socket;
//        };


        var onOpen = function (roomId) {
            connection.connect(roomId);
            console.log("---> onOpen() triggered- Room created with id:" + roomId);
            connection.open(roomId);
            console.log("current session :");
            console.log(connection.sessionid);
        };

        var onJoin = function(roomId)
        {
            connection.connect(roomId);
            console.log("---> join() called - joined room: "+ roomId);
            connection.join(roomId);
            console.log("current session :");
            console.log(connection.sessionid);
        }

        connection.onstream = function(e) {
            console.log(e);
            if((e.type == 'local' || e.type == 'remote') && e.isScreen) {
                var url = $window.URL.createObjectURL(e.stream);
                console.log("!!!! SCREEN !!!!");
                self.screen = {'id': e.extra.id, 'username': e.extra.username, 'stream-type': 'screen', 'stream': $sce.trustAsResourceUrl(url)};
                notifyObservers();
            }
            else if (e.type === 'local') {
                var url = $window.URL.createObjectURL(e.stream);
                self.myuser = {'id' : e.extra.id, 'username' : e.extra.username, 'stream' : $sce.trustAsResourceUrl(url)};
                notifyObservers();
            }
            else if (e.type === 'remote') {
                var url = $window.URL.createObjectURL(e.stream);
                self.users.push({'id': e.extra.id, 'username': e.extra.username, 'stream-type': 'video', 'stream': $sce.trustAsResourceUrl(url)});
                notifyObservers();

            }
        };

        connection.onleave = function(userid, extra) {
            if (extra) console.log(extra.username + ' left you!');
            var video = document.getElementById(userid);
            if (video) video.parentNode.removeChild(video);
        };



//        // on signaling channel called
//        console.log("connect() called - Waiting for rooms to open");

        return {
            getUsers: function(){return self.users},
            getScreen: function(){console.log(self.screen); return self.screen},
            getMyUser: function(){return self.myuser},
            createRoom: function (roomId) {
//                connection.connect();
                onOpen(roomId);
            },
            joinRoom: function(roomId) {
//                connection.connect();
                onJoin(roomId);
            },
            switchPresenter: function(id){
                connection.socket.setPresenter(id);
            },
            registerObserverCallback: function(callback){
                observerCallbacks.push(callback);
            }
        };
    }]);
