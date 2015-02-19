var skin = skin; //load in the schema

//Define angular app
var app = angular.module('app', ['templatescache', 'ngRoute'])

//configure application routes, 
//note: this is using gulp-angular-template-cache so only template names are needed
app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider

			.when('/', {
				templateUrl: 'home.html',
				controller: 'main-controller'
			})

			.when('/edit/:id', {
				templateUrl: 'edit.html',
				controller: 'edit-controller'
			})

			.when('/add', {
				templateUrl: 'edit.html',
				controller: 'add-controller'
			})

			.when('/skin/:id', {
				templateUrl: 'skin.html',
				controller: 'skin-controller'
			})

			.otherwise({
				redirectTo: '/#'
			});

		$locationProvider.html5Mode(false);
}]);

//The main controller
app.controller('main-controller', function($scope, $http, $timeout, $routeParams){

	//request all skins and load them into
	var getSkins = function(){
		$http.get('/api/skin')
			.success(function(data){
				$scope.skins = data;
			})
			.error(function(status){
				console.log('error with: '+status);
			});
		};

		getSkins();

});

app.controller('edit-controller', function($scope, $routeParams, $http){
	$scope.skin = skin;

	//load the skin into scope using our API
	var skin_req = $routeParams.id;
	$scope.skinID = skin_req;

	$http.get('/api/skin/'+skin_req).success(function(data){
		$scope.skin = data;
		console.log('loaded skin');
	})
	.error(function(err){
		console.log(err);
	});



	$scope.addSkin = function(){
			var newSkin = $scope.skin;
			$http.post('/api/skin', newSkin).success(function(data){
				console.log("added a new skin");
			})
			.error(function(status){
				console.log('error adding skin: '+status);
			});
		};

		$scope.deleteSkin = function(){
			$http.delete('/api/skin/'+skin_req).success(function(data){
				console.log("Deleted Skin");
			})
			.error(function(status){
				console.log("err deleting: "+status);
			});
		};



		$scope.updateSkin = function(id){
			$http.put('api/skin/'+id, newSkin).success(function(data){
				console.log("updated skin");
			})
			.error(function(status){
				console.log("failed to update with: "+status);
			});
		};



});


app.controller('skin-controller', function($scope, $routeParams, $http){
	var skin_req = $routeParams.id;
	$scope.skinID = skin_req;


	$http.get('/api/skin/'+skin_req).success(function(data){
		$scope.skin = data.data;
		console.log('loaded skin');
	})
	.error(function(err){
		console.log(err);
	});


});


app.controller('add-controller', function($scope, $http){
	$scope.skin = skin.data;

	$scope.addSkin = function(){
		$http.post('api/skin/', $scope.skin).success(function(data){
		console.log('created new skin');
		})
		.error(function(err){
			console.log(err);
		});
	};


})



















