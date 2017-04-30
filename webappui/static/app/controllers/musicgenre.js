angular.module('webApp.musicGenre', [])
.controller('MusicGenreCtrl', ['$scope','GenreService','$mdSidenav','$mdDialog', function($scope,GenreService,$mdSidenav,$mdDialog) {
    console.log("MusicGenreCtrl");
    $scope.genreDataLoaded = false;
    $scope.genreDetail = [];
    $scope.genresData = [];
    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.addDetails ={
    }
    $scope.editDetails ={
    }
    $scope.paging = {
        current: 1,
    };

// Side navigation functions for add genre
    $scope.toggleAddGenre = function() {
         $scope.addDetails ={
         name:'',
         }
        $mdSidenav('addGenre').toggle();
    };

    $scope.closeAdd = function () {
        $mdSidenav('addGenre').close()
    };

// Side navigation functions for edit genre
    $scope.toggleEditGenre = function(genreId) {
        console.log("GENRE ID -: "+genreId)
        $scope.genreId = genreId;
        console.log(genreId)
        for(var i=0;i<$scope.genresData.length;i++){
            if($scope.genresData[i].id==genreId)
                break;
        }
        var index =i;
        console.log(index)
        $scope.editDetails.name = $scope.genresData[index].name
        console.log($scope.editDetails.name)
        $mdSidenav('editGenre').toggle();
    };

    $scope.closeEdit = function () {
        $mdSidenav('editGenre').close()
    };
    $scope.genreDataLoaded = false;

//  Get all the genres in our database for our listing page.
    $scope.getAllGenres = function(){
    $scope.genresData = [];
    GenreService.getGenres($scope.paging.current,$scope.limit)
    .then(function(data){
        console.log(data.data.data)
        var allGenres = data.data.data
        for(i=0;i<allGenres.length;i++){
            $scope.genresData.push({
                id: allGenres[i].id,
                name: allGenres[i].name,
            })
        $scope.genreDataLoaded = true;
        }
    }, function(error){
        console.log(error)
    })
    }

// Get the count of total genres in our database.
    $scope.totalGenres = function(){
        GenreService.totalGenres()
        .then(function(data){
            console.log(data)
            var count = data.data.count;
            $scope.paging.total = Math.ceil(count/$scope.limit);
            console.log($scope.paging.total)
        }, function(error){
            console.log(error)
        })
    }

//  Adding a new Genre in our database.
    $scope.addGenre = function(ev){
        console.log($scope.addDetails)
        if($scope.addDetails['name']==''){
          $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Please Enter the Genre Name !')
                .ariaLabel('Genre Alert Dialog')
                .ok('OK')
                .targetEvent(ev)
          );
        }
        else{
            GenreService.addGenre($scope.addDetails)
            .then(function(data){
                console.log(data);
                var genreValue = data.data
                var count = genreValue.count;
                $scope.paging.total = Math.ceil(count/$scope.limit);
                $scope.closeAdd()
            },function(error){
                console.log(error)
            })
        }
    }

//  Editing an existing Genre in our database.
    $scope.editGenre = function(ev){
        for(var i=0;i<$scope.genresData.length;i++){
            if($scope.genresData[i].id=$scope.genreId)
                break;
        }
        var index =i;
        console.log($scope.editDetails)
        if($scope.editDetails['name']==''){
          $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Please Enter the Genre Name !')
                .ariaLabel('Genre Alert Dialog')
                .ok('OK')
                .targetEvent(ev)
          );
        }
        else{
            GenreService.editGenre($scope.genreId,$scope.editDetails)
            .then(function(data){
                console.log(data);
                var genreValue = data.data
                $scope.genresData[index].name = genreValue.name;
                $scope.closeEdit();
            },function(error){
                console.log(error)
            })
        }
    }

//  Get an Genre record details from our database.
    $scope.getGenre = function(ev,genreId){
      console.log(genreId)
      GenreService.getGenre(genreId)
      .then(function(data){
        console.log(data)
        var genreResult = data.data
        var genreDetail = {
            id: genreResult.id,
            name: genreResult.name
        };
        $mdDialog.show({
          controller: DialogController,
          templateUrl: '/static/appviews/dialog_genre_detail.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {dataToPass: genreDetail}
        }).then(function (result) {
          }, function () {
            $scope.status = 'You cancelled the dialog.';
            console.log($scope.status)
          });
      },function(error){
        console.log(error)
      })
    }
//  Calling totalGenres() funtion on load of Script.
    $scope.totalGenres();
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