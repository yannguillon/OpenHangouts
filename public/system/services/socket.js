//'use strict';
//// Socket.io factory
angular.module('mean.system').
    factory('mySocket', function (socketFactory) {
        return socketFactory();
    });