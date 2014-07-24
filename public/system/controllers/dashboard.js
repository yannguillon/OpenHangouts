/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').controller('DashboardController', ['$scope', 'Global', 'WebRTC', '$compile',
    function ($scope, Global, WebRTC, $compile) {
        $scope.global = Global;
        this.channel = "";
 
        this.joinChannel = function(){
            console.log(this.channel);
        };

        document.getElementById('init').onclick = function() {
            WebRTC.connect();

        };


//        $(function(){
//            alert("jquery is loaded");
//        });
//        document.getElementByClassName('switch-presenter').onclick = function() {
//            alert("presentouse needs a switch");
//        };

        // et quand je call switch-presenter on click rien ne se passe
    }
]);