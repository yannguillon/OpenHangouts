'use strict';

//Setting up route
angular.module('mean.system').config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // For unmatched routes:
            $urlRouterProvider.otherwise('/');


            var checkLoggedin = function($q, $timeout, $http, $location) {
                // Initialize a new promise
                var deferred = $q.defer();

                // Make an AJAX call to check if the user is logged in
                $http.get('/loggedin').success(function(user) {
                    // Authenticated
                    if (user !== '0') $timeout(deferred.resolve);

                    // Not Authenticated
                    else {
                        $timeout(deferred.reject);
                        $location.url('/login');
                    }
                });

                return deferred.promise;
            };

            // states for my app
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: '/system/views/index.html'
                })
                .state('auth', {
                    templateUrl: '/auth/views/index.html'
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: '/system/views/dashboard.html',
                    resolve: {
                        loggedin: checkLoggedin
                    }
                });
        }
    ])
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);
