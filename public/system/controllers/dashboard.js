/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').controller('DashboardController', ['$scope', 'Global', 'WebRTC',
    function ($scope, Global, WebRTC) {
        $scope.global = Global;
        this.channel = '';
        $scope.randomroom = Math.floor(Math.random()*100000 + 50);
        this.definedroom = '';

        this.joinChannel = function(){
            console.log(this.channel);
        };

        $scope.getRandom = function(){
            return $scope.randomroom;
        };

        $scope.createRoom = function(){
            WebRTC.createRoom($scope.randomroom);
        };

        $scope.joinRoom = function(){
            WebRTC.joinRoom($scope.definedroom);
        };
    }
]);