/**
 * Created by Quentin on 20/07/14.
 */

angular.module('mean.system').controller('DashboardController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;
}]);