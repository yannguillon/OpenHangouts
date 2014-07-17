'use strict';

angular.module('mean.system', ['mean.controllers.login','mean-factory-interceptor', 'btford.socket-io']).
    factory('mySocket', function (socketFactory) {
        console.log("xx");
        var mySocket = socketFactory();
        mySocket.forward('news');
        return mySocket;
    });;