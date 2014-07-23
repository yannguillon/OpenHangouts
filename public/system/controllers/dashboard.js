/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').controller('DashboardController', ['$scope', 'Global', 'WebRTC', '$compile',
    function ($scope, Global, WebRTC, $compile) {
        $scope.global = Global;

        document.getElementById('init').onclick = function() {
            WebRTC.connect();
        };
//        $(function(){
//            alert("jquery is loaded");
//        });
//        document.getElementByClassName('switch-presenter').onclick = function() {
//            alert("presentouse needs a switch");
//        };
        $scope.$watch(
        $('.switch-presenter').on('click', function(){
            alert("presentouse needs a switch");
//            WebRTC.switchPresenter($(this.attr('id')));
        })
        );
        // et quand je call switch-presenter on click rien ne se passe
    }
]);