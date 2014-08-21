/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

/*global RTCMultiConnection */
/*global io */


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
        connection.session = {
            audio: true,
            video: true
        };

        connection.extra = {
            username: Global.user.username,
            fullname: Global.user.name,
            id: Global.user._id,
            isPresenter: false
        };

        self.switchPresenter = function(id) {

        };

        self.errors = {};

        connection.DetectRTC.load(function() {
            if(!connection.DetectRTC.hasMicrophone) {
                self.errors.nomic = 'No microphone found';
                notifyObservers();
            }
            else
                delete self.errors.nomic;
            if(!connection.DetectRTC.hasWebcam) {
                self.errors.nowebcam = 'No webcam found';
                notifyObservers();
            }
            else
                delete self.errors.nowebcam;
        });

        connection.DetectRTC.screen.isChromeExtensionAvailable(function(available) {
            if (connection.UA.Firefox)
            {
                self.errors.nomic = 'Screensharing is not yet implemented on firefox - please install chrome for a full WebRTC experience';
                notifyObservers();
            }

            if(!available && connection.UA.Chrome) {
                delete self.errors.noext;
                self.errors.noext = 'You may need to install the screen-sharing plugin from Chrome if you did not start your browser with the proper flags';
            }
            else
                delete self.errors.noext;
            notifyObservers();
        });

        connection.openSignalingChannel = function(config) {
            var channel = config.channel || defaultChannel;
            var sender = Global.user._id;
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
                self.mysock.emit('setPresenter', {
                    id: id
                });
            };

            self.mysock.on('presenterGiven', function(id){
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
        };


        var onOpen = function (roomId) {
            connection.open(roomId);
            openCustomActionsChannel(roomId, connection);
        };

        var onJoin = function(roomId)
        {
            connection.join(roomId);
            openCustomActionsChannel(roomId, connection);
        };

        connection.streams.mute({
            audio: true,
            video: true,
            type: 'local'
        });

        connection.onstream = function(e) {
            var url;
            if((e.type === 'local' || e.type === 'remote') && e.isScreen) {
                if (e.type === 'local') {
                    self.screenStream = e.streamid;
                }
                url = $window.URL.createObjectURL(e.stream);
                self.screen = {'id': e.extra.id, 'username': e.extra.username, 'stream-type': 'screen', 'stream': $sce.trustAsResourceUrl(url)};
                notifyObservers();
            }
            else if (e.type === 'local') {
                url = $window.URL.createObjectURL(e.stream);
                if (connection.isInitiator)
                    connection.extra.isPresenter = true;
                self.myuser = {'id' : e.extra.id, 'username' : e.extra.username, 'stream' : $sce.trustAsResourceUrl(url), 'isPresenter' : connection.extra.isPresenter};
                notifyObservers();

            }
            else if (e.type === 'remote') {
                url = $window.URL.createObjectURL(e.stream);
                self.users.push({'id': e.extra.id, 'username': e.extra.username, 'stream-type': 'video', 'stream': $sce.trustAsResourceUrl(url), 'isPresenter' : e.extra.isPresenter});
                notifyObservers();
            }
        };

        connection.onstreamended = function(e) {
            if (e.isScreen) {
                if (e.type === 'local') {
                    connection.removeStream(e.streamid);
                    (connection.streams[e.streamid]).stop();
                    self.screenStream = null;
                }
                self.screen = null;
                notifyObservers();
            }
            else {
                console.log(self.users);
                for (var i = 0; i < self.users.length; i++) {
                    if ((self.users[i]).id === e.extra.id) {
                        self.users.splice(i, 1);
                        console.log(self.users);
                        notifyObservers();
                        return;
                    }
                }
            }
        };

        connection.onleave = function(userid, extra) {
            if (extra) console.log(extra.username + ' left you!');
            var video = document.getElementById(userid);
            if (video) video.parentNode.removeChild(video);
        };

        return {
            getUsers: function(){return self.users;},
            getErrors: function(){return self.errors;},
            getScreen: function(){console.log(self.screen); return self.screen;},
            getMyUser: function(){return self.myuser;},
            createRoom: function (roomId) {
                onOpen(roomId);
            },
            joinRoom: function(roomId) {
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
