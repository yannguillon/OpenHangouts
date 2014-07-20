/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').controller('DashboardController', ['$scope', 'Global', 'WebRTC',
    function ($scope, Global, WebRTC) {
        $scope.global = Global;

        document.getElementById('init').onclick = function() {
            WebRTC.connect()
        };
    }
]);