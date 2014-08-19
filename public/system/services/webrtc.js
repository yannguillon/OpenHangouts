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

        self.videoStream = null;
        self.audioStream = null;
        self.screenStream = null;

        self.users = [];
        self.myuser = null;
        self.screen = null;
        self.mysock = null;
        self.fake_screen = false;
        connection.session = {
            audio: true,
            video: true
        };

        //Clean : check if we need the id variable.
        connection.extra = {
            username: Global.user.username,
            fullname: Global.user.name,
            id: Global.user._id,
            isPresenter: false
        };

        self.switchPresenter = function(id) {

        };


//        var onMessageCallbacks = {};
//        var socketio = io.connect(SIGNALING_SERVER);
//
//        socketio.on('message', function(data) {
//            if(data.sender == connection.userid) return;
//            onMessageCallbacks[data.channel](data.message);
//            console.log(data.message);
////            if (onMessageCallbacks[data.channel]) {
////                onMessageCallbacks[data.channel](data.message);
////            };
//        });

//        connection.openSignalingChannel = function (config) {
//            var channel = config.channel || this.channel;
//            onMessageCallbacks[channel] = config.onmessage;
//
//            if (config.onopen) setTimeout(config.onopen, 1000);
//            return {
//                send: function (message) {
//                    socketio.emit('message', {
//                        sender: connection.userid,
//                        username: connection.extra.fullname,
//                        channel: channel,
//                        message: message
//                    });
//                },
//                channel: channel
//            };
//        };


        connection.openSignalingChannel = function(config) {
            var channel = config.channel || defaultChannel;
            var sender = Global.user._id;
            console.log("client wants channel : " + channel);
            io.connect(SIGNALING_SERVER).emit('new-channel', {
                channel: channel,
                sender: sender
            });

            var socket = io.connect(SIGNALING_SERVER + channel);
            socket.channel = channel;
            socket.on('connect', function() {
                if (config.callback) config.callback(socket);
            });




            socket.send = function(message) {
                socket.emit('message', {
                    sender: sender,
                    data: message
                });
            };
            socket.on('message', config.onmessage);

            connection.socket = socket;
        };


        var openCustomActionsChannel = function(channel, connection)
        {
            io.connect(SIGNALING_SERVER).emit('new-custom-channel', {
                channel: channel,
                sender:  Global.user._id
            });

            self.mysock = io.connect(SIGNALING_SERVER + channel, {custom : true});
            self.mysock.setPresenter = function(id){
//                if (self.screenStream !== null){

//                }
                self.mysock.emit('setPresenter', {
                    id: id
                })
            };

            self.mysock.on('presenterGiven', function(id){
                console.log("Presenter Given called");
                if (id === Global.user._id){
                    connection.extra.isPresenter = true;
                    self.myuser.isPresenter = true;
                    self.mysock.emit('notifyNewPresenter', id);
                }
                for (var i = 0; self.users && i < self.users.length; i++){
                    self.users[i].isPresenter = ((self.users[i]).id === id);
                }
                notifyObservers();
            });

            self.mysock.on('newPresenterSet', function(id){
                if (connection.extra.isPresenter === true){
                    connection.extra.isPresenter = false;
                    self.myuser.isPresenter = false;
                }
                for (var i = 0; self.users && i < self.users.length; i++){
                    self.users[i].isPresenter = ((self.users[i]).id === id);
                }
                notifyObservers();
            });
        }


        var onOpen = function (roomId) {
            console.log("---> onOpen() triggered- Room created with id:" + roomId);
            connection.open(roomId);
            openCustomActionsChannel(roomId, connection);
            console.log("current session :");
            console.log(connection.sessionid);
        };

        var onJoin = function(roomId)
        {
            console.log("---> join() called - joined room: "+ roomId);
            connection.join(roomId);
            openCustomActionsChannel(roomId, connection);
            console.log("current session :");
            console.log(connection.sessionid);
        }

        connection.streams.mute({
            audio: true,
            video: true,
            type: 'local'
        });

        connection.onstream = function(e) {
            if((e.type == 'local' || e.type == 'remote') && e.isScreen) {
                if (e.type == 'local') {
                    self.screenStream = e.streamid;
                }
                var url = $window.URL.createObjectURL(e.stream);
                console.log("screen added");
                self.screen = {'id': e.extra.id, 'username': e.extra.username, 'stream-type': 'screen', 'stream': $sce.trustAsResourceUrl(url)};
                notifyObservers();
            }
//            else if (e.type == 'local' && e.isVideo)
//            {
//                console.log("needs mute");
//                connection.streams[e.streamid].mute({
//                    audio: true,
//                    video: true
//                });
//            }

            else if (e.type === 'local') {
                var url = $window.URL.createObjectURL(e.stream);
                if (connection.isInitiator)
                    connection.extra.isPresenter = true;
                self.myuser = {'id' : e.extra.id, 'username' : e.extra.username, 'stream' : $sce.trustAsResourceUrl(url), 'isPresenter' : connection.extra.isPresenter};
                notifyObservers();

            }
            else if (e.type === 'remote') {
                var url = $window.URL.createObjectURL(e.stream);
                self.users.push({'id': e.extra.id, 'username': e.extra.username, 'stream-type': 'video', 'stream': $sce.trustAsResourceUrl(url), 'isPresenter' : e.extra.isPresenter});
                notifyObservers();
            }
        };

//        connection.onleave = function(e) {
//
//        }


        connection.onstreamended = function(e) {
            if (e.isScreen) {
                if (e.type === 'local') {
                    connection.removeStream(e.streamid);
                    (connection.streams[e.streamid]).stop();
                    self.screenStream = null;
                    console.log("streams");
                    console.log(connection.streams);
                }
                self.screen = null;
                notifyObservers();
            }
            else {
                console.log(self.users);
                for (var i = 0; i < self.users.length; i++) {
                    console.log((self.users[i]).id + " == " + e.extra.id);
                    if ((self.users[i]).id == e.extra.id) {
                        self.users.splice(i, 1);
                        console.log(self.users);
                        notifyObservers();
                        return;
                    }
                }
            }
//            console.log("stream removed : type : " + e.type );
//            if (e.type === 'local'){
//                if (e.isAudio){
//                    console.log("audio");
//                    self.audioStream = null;
//                }
//                if (e.isVideo){
//                    console.log("video");
//                    self.videoStream = null;
//                }
//                if (e.isScreen){
//                    console.log("screen");
//                    self.screenStream = null;
//                }
//            }
        };


        connection.onleave = function(userid, extra) {
            if (extra) console.log(extra.username + ' left you!');
            var video = document.getElementById(userid);
            if (video) video.parentNode.removeChild(video);
        };





//        // on signaling channel called
//        console.log("connect() called - Waiting for rooms to open");

        return {
            getUsers: function(){return self.users;},
            getScreen: function(){console.log(self.screen); return self.screen;},
            getMyUser: function(){return self.myuser;},
            createRoom: function (roomId) {
//                connection.connect();
                onOpen(roomId);
            },
            joinRoom: function(roomId) {
//                connection.connect();
                onJoin(roomId);
            },
            switchPresenter: function(id){
                self.mysock.setPresenter(id);
            },
            registerObserverCallback: function(callback){
                observerCallbacks.push(callback);
            },
            startSharingScreen: function(){
                connection.addStream({
                    screen: true,
                    oneway: true
                });
            }
        };
    }]);
