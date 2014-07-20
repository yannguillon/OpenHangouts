/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').
    factory('WebRTC', ['Global', 'mySocket', function (Global, mySocket) {
        var SIGNALING_SERVER    = '/';
        var defaultChannel      = location.hash.substr(1) || 'video-conferencing-hangout';
        var username            = Math.random() * 9999 << 9999;
        var connection          = new RTCMultiConnection(defaultChannel);

        connection.session = {
            audio: true,
            video: true,
            screen: true
        };

        connection.openSignalingChannel = function(config) {
            var channel = config.channel || defaultChannel;
            var sender = Global.user._id; //Math.round(Math.random() * 60535) + 5000;

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
        };

        connection.onstream = function(e) {
            if (e.type === 'local') {
//            var video = getMediaElement(getVideo(e), {
//                width: (videosContainer.clientWidth / 2) - 50,
//                    buttons: ['mute-audio', 'mute-video', 'full-screen', 'volume-slider']
//                        });

                var video = getVideo(e, {
                    username: username
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

        connection.extra = {
            username: username
        };

        connection.connect();

        function getVideo(e, extra) {
            var div = document.createElement('div');
            div.className = 'video-container';
            div.id = e.userid || 'self';

            if (e.type === 'remote') {
                if (connection.isInitiator) {
                    var eject = document.createElement('button');
                    eject.className = 'eject';
                    eject.title = 'Eject this User';

                    eject.onclick = function() {
                        connection.eject(this.parentNode.id);
                        this.parentNode.style.display = 'none';
                    };
                    div.appendChild(eject);
                }
            }
            div.appendChild(e.mediaElement);

            if (extra) {
                var h2 = document.createElement('h2');
                h2.innerHTML = 'username: ' + extra.username;
                div.appendChild(h2);
            }
            return div;
        }

        return {
            connect: function() {
                connection.interval = 1000;
                connection.open();
            }
        };
    }]);
