/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').controller('NavbarController', ['$scope', '$rootScope', 'Global',
    function($scope, $rootScope, Global) {
        $scope.global = Global;
        $scope.navItems = [
            {icon: 'glyphicon-user', name: 'profile'},
            {icon: 'glyphicon-user', name: 'profile'},
            {icon: 'glyphicon-user', name: 'profile'},
            {icon: 'glyphicon-user', name: 'profile'},
            {icon: 'glyphicon-user', name: 'profile'},
            {icon: 'glyphicon-user', name: 'profile'}
        ];


    }
]);
