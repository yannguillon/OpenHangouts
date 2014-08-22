/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').controller('DashboardController', ['$scope', 'Global', 'WebRTC',
    function ($scope, Global, WebRTC) {
        $scope.global = Global;
        this.channel = '';
        $scope.randomroom = Math.floor(Math.random()*100000 + 50);
        $scope.definedroom = { id: '' };
        $scope.roomControl = {started: false, text : 'Open a NEW Room'};

        $scope.getRandom = function(){
            return $scope.randomroom;
        };

        $scope.createRoom = function(){
            if ($scope.roomControl.started === false) {
                WebRTC.createRoom(''+$scope.randomroom);
                $scope.roomControl = {started: true, text: 'Stop current Room'};
            }
            else {
                WebRTC.stopRoom();
                $scope.roomControl = {started: false, text: 'Open a NEW Room'};
            }
        };

        $scope.joinRoom = function(){
            WebRTC.joinRoom($scope.definedroom.id);
        };
    }
]);