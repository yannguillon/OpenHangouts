 //'use strict';
//// Socket.io factory

'use strict';
angular.module('mean.system').
    factory('mySocket', function (socketFactory) {
        return socketFactory();
    });
