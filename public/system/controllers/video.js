'use strict';

angular.module('mean.system').controller('VideoController', ['$rootScope', '$scope', 'Global', 'WebRTC',
    function ($rootScope, $scope, Global, WebRTC) {
        WebRTC.registerObserverCallback(function(){
            $scope.myuser = WebRTC.getMyUser();
            $scope.users = WebRTC.getUsers();
            $scope.screen = WebRTC.getScreen();
            console.log("SCReeeeeeeeeeeeeeeeeeeeeeN:" + $scope.screen);
            $scope.$apply();
        });

        this.switchPresenter = function(id){
            console.log("switch Presenter");
            WebRTC.switchPresenter(id);
        };

        $scope.$watch(
            $('.switch-presenter').on('click', function(){
                alert("presentouse needs a switch");
//            WebRTC.switchPresenter($(this.attr('id')));
            })
        );
    }
]);