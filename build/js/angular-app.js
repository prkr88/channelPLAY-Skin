//Define angular app
var app = angular.module('app', ['templatescache', 'ngRoute', 'ngAnimate', 'ngTouch', 'wu.masonry'])

//configure application routes, 
//note: this is using gulp-angular-template-cache so only template names are needed
app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'home.html',
        controller: 'main-controller'
      })

      .when('/view1', {
        templateUrl: 'view1.html',
        controller: 'main-controller'
      })

      .when('/view2', {
        templateUrl: 'view2.html',
        controller: 'main-controller'
      })

      .when('/view3/:id', {
        templateUrl: 'view3.html',
        controller: 'view3-controller'
      })

      .when('/view3', {
        templateUrl: 'view3.html',
        controller: 'view3-controller'
      })

      .otherwise({
      	redirectTo: '/#'
      });

    $locationProvider.html5Mode(false);
}]);

//The main controller
app.controller('main-controller', function($scope, $http, $timeout){

  $scope.clearSkin = function(){
      $scope.skin_name = '';
      $scope.skin_url = '';
      $scope.skin_id = '';
  }

  //request all skins and load them into
  var getSkins = function(){
    $http.get('/api/skin')
      .success(function(data){
        $scope.skins = data;
      })
      .error(function(status){
        console.log('error with: '+status);
      });
      $scope.clearSkin();
    };

    $scope.deleteSkin = function(id){
      $http.delete('/api/skin/'+id).success(function(data){
        console.log("Deleted Skin");
      })
      .error(function(status){
        console.log("err deleting: "+status);
      });
      refresh = function(){

      }
      $timeout(getSkins, 1000);
    };

    $scope.addSkin = function(){
      var newSkin = {name: $scope.skin_name, url: $scope.skin_url}
      $http.post('/api/skin', newSkin).success(function(data){
        console.log("added a new skin");
      })
      .error(function(status){
        console.log('error adding skin: '+status);
      });
      $timeout(getSkins, 1000);
    };

    $scope.updateSkin = function(id){
      var newSkin = {name: $scope.skin_name, url: $scope.skin_url};
      $http.put('api/skin/'+id, newSkin).success(function(data){
        console.log("updated skin");
      })
      .error(function(status){
        console.log("failed to update with: "+status);
      });
      $timeout(getSkins, 1000);
    };

    $scope.editSkin = function(skin){
      $scope.skin_id = skin._id;
      $scope.skin_url = skin.url;
      $scope.skin_name = skin.name;
    };

    getSkins();
});

app.controller('view3-controller', function($scope, $routeParams){
  $scope.routeId = $routeParams.id;
})
