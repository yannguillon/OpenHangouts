'use strict';

angular.module('mean.system').controller('VideoController', ['$rootScope', '$scope', 'Global', 'WebRTC',
    function ($rootScope, $scope, Global, WebRTC) {
        $scope.errorsdisplay = {};
        WebRTC.registerObserverCallback(function(){
            $scope.myuser = WebRTC.getMyUser();
            $scope.users = WebRTC.getUsers();
            $scope.screen = WebRTC.getScreen();
            $scope.errors = WebRTC.getErrors();
            for (var key in $scope.errors)
                $scope.errorsdisplay[key] = true;
            $scope.$apply();
        });

        $scope.isPresentingSwitchAllowed = function()
        {
            return $scope.myuser.isPresenter && !WebRTC.isScreensharingEnabled();
        };


        $scope.hideError = function(key)
        {
            delete $scope.errorsdisplay[key];
        };

        $scope.haveErrorsToDisplay = function()
        {
            return Object.keys($scope.errorsdisplay).length;
        };

        this.switchPresenter = function(id){
            WebRTC.switchPresenter(id);
        };

        this.startSharingScreen = function(){
            WebRTC.startSharingScreen();
        };

        this.getUserStatus = function(user){
            return user.isPresenter ? 'Presenter' : '';
        };
    }
]);