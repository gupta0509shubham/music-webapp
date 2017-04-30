angular.module('webApp.musicTrack', [])
.controller('MusicTrackCtrl', ['$scope','TrackService','$mdSidenav','$mdDialog', function($scope,TrackService,$mdSidenav,$mdDialog) {
    console.log("MusicTrackCtrl");
    $scope.trackId;
    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.genres = []
    $scope.addDetails ={
    }
    $scope.editDetails ={
    }
    $scope.paging = {
        current: 1,
    };

// Side navigation functions for add track
    $scope.toggleAddTrack = function(triggerId) {
         $scope.addDetails ={
         name:'',
         }
        $mdSidenav('addTrack').toggle();
    };

    $scope.closeAdd = function () {
        $mdSidenav('addTrack').close()
    };

// Side navigation functions for edit track
    $scope.toggleEditTrack = function(trackId) {
        $scope.trackId = trackId;
        console.log(trackId)
        for(var i=0;i<$scope.tracksData.length;i++){
            if($scope.tracksData[i].id==trackId)
                break;
        }
        var index =i;
        console.log(index)
        $scope.editDetails.name = $scope.tracksData[index].title;
        $scope.editDetails.rating = $scope.tracksData[index].rating;
        $scope.editDetails.genres = '';
        console.log($scope.editDetails)
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
    $scope.addTrack = function(ev){
        console.log($scope.addDetails)
        if($scope.addDetails['name']== ''){
          $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Please Enter all Details !')
                .ariaLabel('Track Alert Dialog')
                .ok('OK')
                .targetEvent(ev)
          );
        }
        else if($scope.addDetails['rating']== undefined){
          $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Please Enter all Details !')
                .ariaLabel('Track Alert Dialog')
                .ok('OK')
                .targetEvent(ev)
          );
        }
        else if($scope.addDetails['genres']== undefined){
          $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Please Enter all Details !')
                .ariaLabel('Track Alert Dialog')
                .ok('OK')
                .targetEvent(ev)
          );
        }
        else{
        TrackService.addTracks($scope.addDetails)
        .then(function(data){
            console.log(data);
            var count  = data.data.count;
            var trackValue = data.data
            console.log(trackValue);
            $scope.paging.total = Math.ceil(count/$scope.limit);
            $scope.tracksData.unshift({
                id: trackValue.id,
                title: trackValue.title,
                rating: trackValue.rating,
                genres: trackValue.genres
            })
            $scope.closeAdd();
        },function(error){
            console.log(error)
        })
        }
    }

//  Get an Track record details from our database.
    $scope.getTrack = function(ev,trackId){
      console.log(trackId)
      TrackService.getTrack(trackId)
      .then(function(data){
        console.log(data)
        var trackResult = data.data
        console.log(trackResult)
        var trackDetail = {
            id: trackResult.id,
            name: trackResult.name,
            rating: trackResult.rating,
            genres: trackResult.genres
        };
        $mdDialog.show({
          controller: DialogController,
          templateUrl: '/static/appviews/dialog_track_detail.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {dataToPass: trackDetail}
        }).then(function (result) {
          }, function () {
            $scope.status = 'You cancelled the dialog.';
            console.log($scope.status)
          });
      },function(error){
        console.log(error)
      })
    }
//  Editing an existing Track in our database.
    $scope.editTrack = function(ev){
        for(var i=0;i<$scope.tracksData.length;i++){
            if($scope.tracksData[i].id==$scope.trackId)
                break;
        }
        var index =i;
        console.log()
        console.log($scope.editDetails)
        if($scope.editDetails['genres']==''){
          $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Please Select the track genres !')
                .ariaLabel('Genre Alert Dialog')
                .ok('OK')
                .targetEvent(ev)
          );
        }
        else{
            TrackService.editTrack($scope.trackId,$scope.editDetails)
            .then(function(data){
                console.log(data);
                var trackValue = data.data
                $scope.tracksData[index].title = trackValue.name;
                $scope.tracksData[index].rating = trackValue.rating;
                $scope.tracksData[index].genres = trackValue.genres;
                $scope.closeEdit();
            },function(error){
                console.log(error)
            })
        }
    }

// Search the track throughout our database

$scope.searchTrack = function(){
    console.log($scope.searchTerm);
    TrackService.searchTrack($scope.searchTerm)
    .then(function(data){
        $scope.tracksData = [];
        console.log(data);
        var searchedTracks = data.data.data
        for(i=0;i<searchedTracks.length;i++){
            $scope.tracksData.push({
                id: searchedTracks[i].id,
                title: searchedTracks[i].title,
                rating: searchedTracks[i].rating,
                genres: searchedTracks[i].genres
            })
        }
    },function(){
        console.log(error)
    })
}

    $scope.totalTracksAndGenres();
}]);
var DialogController = function ($scope, $mdDialog,dataToPass) {
    console.log(dataToPass)
    $scope.details = dataToPass
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }