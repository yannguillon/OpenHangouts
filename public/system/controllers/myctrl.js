/**
 * Created by yann on 17/07/14.
 */

angular.module('mean.system').controller('MyCtrl', ['$scope', 'Global', 'mySocket', function ($scope, Global, mySocket) {
    console.log(Global.user);
    var SIGNALING_SERVER = '/',
        defaultChannel = 'openhangouts-default';

    var connection = new RTCMultiConnection(defaultChannel);

    connection.session = {
        audio: true,
        video: true
    };

    connection.openSignalingChannel = function(config) {
        var channel = config.channel || defaultChannel;
        var sender = Global.user._id; //Math.round(Math.random() * 60535) + 5000;
        // if no user id : redirect to login
        mySocket.emit('new-channel', {
            channel: channel,
            sender: sender
        });

        connection.extra = {
            username: Global.user.username,
            fullname: Global.user.name
        };
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
//            var video = getMediaElement(getVideo(e), {
//                width: (videosContainer.clientWidth / 2) - 50,
//                    buttons: ['mute-audio', 'mute-video', 'full-screen', 'volume-slider']
//                        });

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
            var h22 = document.createElement('h2');
            h2.innerHTML = 'username: ' + extra.username;
            h22.innerHTML = 'name: ' + extra.fullname;
            div.appendChild(h2);
            div.appendChild(h22);
        }
        return div;
    }


//    /// start the connection
//
//    document.getElementById('init').onclick = function() {
//        connection.interval = 1000;
//        connection.open();
//    };

    connection.extra = {
        username: window.username
    };

    connection.connect();
/////////////////////////////////////////////// experiments > gonna be useful
//    function Room(name) {
//        this.name = name;
//        this.presenter = null;
//    };
//
//
//    socket.on('message', function (data) {
//        console.log(data);
//        $('#message').html(data);
//    });
//
//    $('#createRoom').click(function() {
//        var presenter = $('#userId').val();
//        socket.emit('create', presenter);
//    });

///////////////////////////////////////////////////////////////////////////////

}
]);