/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').controller('DashboardController', ['$scope', 'Global', 'WebRTC', '$compile',
    function ($scope, Global, WebRTC, $compile) {
        $scope.global = Global;
        this.channel = "";
 
        this.joinChannel = function(){
            console.log(this.channel);
        };


        var random = Math.floor(Math.random()*100000 + 50);
        $scope.getRandom = function(){
            return random;
        }

        $('.create-room').on('click', function() {
            WebRTC.createRoom($(this).attr('id'));
        });

        $('.join-room').on('click', function() {
            WebRTC.joinRoom($('#room-id').val());
        });


//        $(function(){
//            alert("jquery is loaded");
//        });
//        document.getElementByClassName('switch-presenter').onclick = function() {
//            alert("presentouse needs a switch");
//        };

        // et quand je call switch-presenter on click rien ne se passe
    }
]);