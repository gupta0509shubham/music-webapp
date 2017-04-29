var webApp = angular.module('webApp', [
    'ui.router',
    'webApp.musicTrack',
    'webApp.musicGenre',
    'trackServices',
    'genreServices',
    'smart-table',
    'jkAngularRatingStars',
    'cl.paging',
    'ngMaterial'
    ]);

webApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.hashPrefix('musicapp');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                "mainContent@":{
                    templateUrl:'/static/appviews/home.html',
                }},
        })
        .state('home.musictrack', {
            url: '/musictrack',
            views: {
                "mainContent@":{
                    templateUrl:'/static/appviews/musictrack.html',
                    controller:'MusicTrackCtrl'
                }},
        })
        .state('home.musicgenre', {
            url: '/musicgenre',
            views: {
                "mainContent@":{
                    templateUrl:'/static/appviews/musicgenre.html',
                    controller:'MusicGenreCtrl'
                }},
        })
});