'use strict';

angular.module('mean.system').controller('VideoController', ['$rootScope', '$scope', 'Global', 'WebRTC',
    function ($rootScope, $scope, Global, WebRTC) {
        WebRTC.registerObserverCallback(function(){
            $scope.myuser = WebRTC.getMyUser();
            $scope.users = WebRTC.getUsers();
            $scope.screen = WebRTC.getScreen();
            $scope.$apply();
        });

        this.switchPresenter = function(id){
            WebRTC.switchPresenter(id);
        };

        this.startSharingScreen = function(){
            WebRTC.startSharingScreen();
        };
        this.stopSharingScreen = function(){
            WebRTC.stopSharingScreen();
        };
    }
]);