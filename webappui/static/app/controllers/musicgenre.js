angular.module('webApp.musicGenre', [])
.controller('MusicGenreCtrl', ['$scope','GenreService','$mdSidenav', function($scope,GenreService,$mdSidenav) {
    console.log("MusicGenreCtrl");
    $scope.genreDataLoaded = false;
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
    $scope.toggleAddGenre = function(triggerId) {
         $scope.addDetails ={
         name:'',
         }
        $mdSidenav('addGenre').toggle();
    };

    $scope.closeAdd = function () {
        $mdSidenav('addGenre').close()
    };

    $scope.toggleEditGenre = function(genreId) {
        $scope.genreId = genreId;
        for(var i=0;i<$scope.genresData.length;i++){
            if($scope.genresData.id=genreId)
                break;
        }
        var index =i;
        $scope.editDetails.name = $scope.genresData[index].name
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
    $scope.addGenre = function(){
        console.log($scope.addDetails)
        GenreService.addGenre($scope.addDetails)
        .then(function(data){
            console.log(data);
            var genreValue = data.data
            var count = genreValue.count;
            $scope.paging.total = Math.ceil(count/$scope.limit);
        },function(error){
            console.log(error)
        })
    }

//  Editing an existing Genre in our database.
    $scope.editGenre = function(){
        for(var i=0;i<$scope.genresData.length;i++){
            if($scope.genresData.id=$scope.genreId)
                break;
        }
        var index =i;
        console.log($scope.editDetails)
        GenreService.editGenre($scope.genreId,$scope.editDetails)
        .then(function(data){
            console.log(data);
            var genreValue = data.data
            $scope.genresData[index].name = genreValue.name;
        },function(error){
            console.log(error)
        })
    }

//  Calling totalGenres() funtion on load of Script.
    $scope.totalGenres();
}]);
