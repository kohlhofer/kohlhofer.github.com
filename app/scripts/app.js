'use strict';

angular.module('kohlhoferApp', ['ngRoute','ngSanitize','ngAnimate','angularSmoothscroll'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeCtrl'
      })
      .when('/project/:id', {
        controller: 'HomeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
