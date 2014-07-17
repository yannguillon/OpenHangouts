'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;
}]).controller('system', function ($scope) {
    console.log("ANGOULARRR");
    $scope.$on('socket:news', function (ev, data) {
        console.log("ANGOULARRR"+data);
    });
});

