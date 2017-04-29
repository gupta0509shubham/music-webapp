angular.module('webApp.musicTrack', [])
.controller('MusicTrackCtrl', ['$scope','TrackService','$mdSidenav',function($scope,TrackService,$mdSidenav) {
    console.log("MusicTrackCtrl");
    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.genres = []
    $scope.addDetails ={
    }
    $scope.paging = {
        current: 1,
    };
    $scope.toggleAddTrack = function(triggerId) {
         $scope.addDetails ={
         name:'',
         }
        $mdSidenav('addTrack').toggle();
    };

    $scope.closeAdd = function () {
        $mdSidenav('addTrack').close()
    };
    $scope.toggleEditTrack = function(triggerId) {
        $mdSidenav('editTrack').toggle();
    };

    $scope.closeEdit = function () {
        $mdSidenav('editTrack').close()
    };
    $scope.tracksData = [];
    $scope.trackDataLoaded = false;
    $scope.totalTracksAndGenres = function(){
        TrackService.totalTracksAndGenres()
        .then(function(data){
            console.log(data)
            var count = data.data.count;
            var genres = data.data.genres;
            $scope.paging.total = Math.ceil(count/$scope.limit);
            for(var i=0;i<genres.length;i++){
                $scope.genres.push({
                    id: genres[i].id,
                    name: genres[i].name
                })
            }
            console.log($scope.genres);
        }, function(error){
            console.log(error)
        })
    }
    $scope.getAllTracks = function(){
        $scope.tracksData = []
        TrackService.getTracks($scope.paging.current,$scope.limit)
        .then(function(data){
            console.log(data)
            var allTracks = data.data.data
            for(i=0;i<allTracks.length;i++){
                $scope.tracksData.push({
                    id: allTracks[i].id,
                    title: allTracks[i].title,
                    rating: allTracks[i].rating,
                    genres: allTracks[i].genres
                })
            }
            $scope.trackDataLoaded = true;
        }, function(error){
            console.log(error)
        })
    }
    $scope.addTrack = function(){
        console.log($scope.addDetails)
        TrackService.addTracks($scope.addDetails)
        .then(function(data){
            console.log(data);
        },function(error){
            console.log(error)
        })
    }
    $scope.totalTracksAndGenres();
}]);
