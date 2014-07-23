/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').
    factory('WebRTC', ['Global', 'mySocket', function (Global, mySocket) {
        var SIGNALING_SERVER = '/',
            defaultChannel = 'openhangouts-default';

        var connection = new RTCMultiConnection(defaultChannel);

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

        connection.openSignalingChannel = function(config) {
            var channel = config.channel || defaultChannel;
            var sender = Global.user._id; //Math.round(Math.random() * 60535) + 5000;
            // if no user id : redirect to login
            mySocket.emit('new-channel', {
                channel: channel,
                sender: sender
            });


            var socket = io.connect(SIGNALING_SERVER + channel);
            socket.channel = channel;
            socket.on('connect', function() {
                if (config.callback) config.callback(socket);
            });

            socket.switchPresenter = function(id) {
                if (connection.isInitiator())
                {
                    socket.emit('setPresenter', {
                        userid: id
                    });
                }
                else
                {
                    alert("only the creator of the call can do that");
                }
            }
            socket.send = function(message) {
                socket.emit('message', {
                    sender: sender,
                    data: message
                });
            };
            socket.on('message', config.onmessage);
        };

        connection.onstream = function(e) {
            if (e.type === 'local') {
                var video = getVideo(e, {
                    username:  Global.user.username,
                    fullname: Global.user.name
                });

                document.getElementById('local-video-container').appendChild(video);
            }

            if (e.type === 'remote') {
                var video = getVideo(e, e.extra);

                var remoteVideosContainer = document.getElementById('remote-videos-container');
                remoteVideosContainer.appendChild(video, remoteVideosContainer.firstChild);
            }
            e.mediaElement.width = innerWidth / 3.4;
        };

        connection.onleave = function(userid, extra) {
            if (extra) console.log(extra.username + ' left you!');

            var video = document.getElementById(userid);
            if (video) video.parentNode.removeChild(video);
        };

        function getVideo(e, extra) {
            var div = document.createElement('div');
            div.className = 'video-container';
            div.id = e.userid || 'self';
            if (e.type === 'remote') {
                if (connection.isInitiator) {
                    alert("BOBOBOBOBO");
                    var switchPresenter = document.createElement('button');
                    switchPresenter.className = "switch-presenter";
                    switchPresenter.setAttribute("id", extra.id);

                    switchPresenter.innerHTML = "set as presenter";
                    var eject = document.createElement('div');
                    eject.className = 'eject';
                    eject.title = 'Eject this User';

                    eject.onclick = function() {
                        connection.eject(this.parentNode.id);
                        this.parentNode.style.display = 'none';
                    };
                    div.appendChild(switchPresenter);
                    div.appendChild(eject);
                }
            }
            div.appendChild(e.mediaElement);

            if (extra) {
                var h2 = document.createElement('h2');
                var h22 = document.createElement('h2');
                h2.innerHTML = 'username: ' + extra.username;
                h22.innerHTML = 'name: ' + extra.fullname;
                div.appendChild(h2);
                div.appendChild(h22);
            }
            return div;
        }

        connection.connect();

        return {
            connect: function() {
                connection.interval = 1000;
                connection.open();
            },
            switchPresenter: function(id){
                socket.switchPresenter(id);
            }
        };
    }]);
