var genreServices = angular.module('genreServices', []);

genreServices.service('GenreService', ['$http',  function($http){
    console.log("GenreService");
    this.getGenres = function(pageNumber,pageLimit){
        console.log("pageNumber-: "+pageNumber+'pageLimit-: '+pageLimit);
        return $http.get('/genres?pageNumber='+pageNumber+'&pageLimit='+pageLimit);
    }
    this.totalGenres = function(){
        return $http.get('/total_genres');
    }
    this.getGenre = function(genreId){
        return $http.get('/get_genre?genreId='+genreId);
    }
    this.addGenre = function(addDetails){
        return $http.post('/add_genres/',{
            addDetails : addDetails
        });
    }
    this.editGenre = function(genreId,editDetails){
        return $http.post('/edit_genre/',{
            genreId: genreId,
            editDetails : editDetails
        });
    }
}]);