'use strict';

angular.module('mean.system').controller('VideoController', ['$rootScope', '$scope', 'Global', 'WebRTC',
    function ($rootScope, $scope, Global, WebRTC) {
        WebRTC.registerObserverCallback(function(){
            $scope.myuser = WebRTC.getMyUser();
            $scope.users = WebRTC.getUsers();
            $scope.$apply();
        });

        this.switchPresenter = function(id){
            console.log('video.js : switchPresenter');
            WebRTC.switchPresenter(id);
        };
    }
]);