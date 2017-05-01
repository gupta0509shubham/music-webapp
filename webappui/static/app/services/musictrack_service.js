var trackServices = angular.module('trackServices', ['ngResource']);

trackServices.service('TrackService', ['$http',  function($http){
    console.log("TrackService");
    this.getTracks = function(pageNumber,pageLimit){
        console.log("pageNumber-: "+pageNumber+'pageLimit-: '+pageLimit);
        return $http.get('/tracks?pageNumber='+pageNumber+'&pageLimit='+pageLimit);
    }
    this.getTrack = function(trackId){
        return $http.get('/get_track?trackId='+trackId);
    }
    this.searchTrack = function(text){
        return $http.get('/search_track?text='+text);
    }
    this.totalTracksAndGenres = function(){
        return $http.get('/total_tracks_genres');
    }
    this.addTracks = function(addDetails,genres){
        return $http.post('/add_tracks/',{
            addDetails : addDetails,
            genres: genres
        });
    }
    this.editTrack = function(trackId,editDetails,genres){
        return $http.post('/edit_track/',{
            trackId: trackId,
            editDetails : editDetails,
            genres: genres
        });
    }
}]);