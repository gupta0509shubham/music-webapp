var trackServices = angular.module('trackServices', ['ngResource']);

trackServices.service('TrackService', ['$http',  function($http){
    console.log("TrackService");
    this.getTracks = function(pageNumber,pageLimit){
        console.log("pageNumber-: "+pageNumber+'pageLimit-: '+pageLimit);
        return $http.get('/tracks?pageNumber='+pageNumber+'&pageLimit='+pageLimit);
    }
    this.totalTracksAndGenres = function(){
        return $http.get('/total_tracks_genres');
    }
    this.addTracks = function(addDetails){
        return $http.post('/add_tracks/',{
            addDetails : addDetails
        });
    }
}]);