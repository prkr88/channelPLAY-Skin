var skin = skin; //load in the schema
var firebaseURL = "https://brilliant-heat-8775.firebaseio.com"

//Define angular app
var app = angular.module('app', ['templatescache', 'ngRoute', 'webfont-loader', 'firebase'])

app.run(function($rootScope, $location){
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/home");
    }
  });
});

//configure application routes, 
//note: this is using gulp-angular-template-cache so only template names are needed
app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				redirectTo: '/login'
			})

			.when('/templates', {
				templateUrl: 'templates.html',
				controller: 'template-controller',
				resolve: {
			      "currentAuth": ["Auth", function(Auth) {
			        return Auth.$requireAuth();
			      }]
				}
			})

			.when('/edit/:id', {
				templateUrl: 'edit.html',
				controller: 'edit-controller',
				resolve: {
			      "currentAuth": ["Auth", function(Auth) {
			        return Auth.$requireAuth();
			      }]
				}
			})

			.when('/add', {
				templateUrl: 'edit.html',
				controller: 'add-controller',
				resolve: {
			      "currentAuth": ["Auth", function(Auth) {
			        return Auth.$requireAuth();
			      }]
				}
			})

			.when('/skin/:id', {
				templateUrl: 'skin.html',
				controller: 'skin-controller',
				resolve: {
			      "currentAuth": ["Auth", function(Auth) {
			        return Auth.$requireAuth();
			      }]
				}
			})

			.when('/login', {
				templateUrl: 'login.html',
				controller: 'auth-controller'
			})

			.otherwise({
				redirectTo: '/login'
			});

		$locationProvider.html5Mode(false);
}]);

app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  var ref = new Firebase(firebaseURL);
  // console.log("running factory");
  return $firebaseAuth(ref);
}]);

//The main controller
app.controller('main-controller', function($scope, $http, $location, $timeout){
	//request all skins and load them into
	$http.get('/api/skin').success(function(data){
			$scope.skins = data;
		})
		.error(function(status){
			console.log('error with: '+ status);
		});

	//create a new skin, use schema
	$scope.addSkin = function(){
		$http.post('/api/skin', skin.data).success(function(data){
			var skinID = data.id;
			console.log("created: "+ skinID);
			$location.path('/edit/'+ skinID);
		})
		.error(function(err){
			console.log(err);
		});
	};

	$scope.deleteSkin = function(id){
			$http.delete('/api/skin/'+id).success(function(data){
				console.log("Deleted Skin");
			})
			.error(function(status){
				console.log("err deleting: "+status);
			});
		};

});

app.controller('edit-controller', function($scope, $routeParams, $http, $location){
	//load the skin into scope using our API
	var skin_req = $routeParams.id;
	$scope.skinID = skin_req;

	$http.get('/api/skin/'+skin_req).success(function(data){
		if(!data){
			$location.path('/');
		}
		else{
			$scope.skin = data.data;
			console.log('loaded skin');
		}
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
				$location.path('/');
			})
			.error(function(status){
				console.log("err deleting: "+status);
			});
		};



		$scope.updateSkin = function(){
			var skin = $scope.skin;
			$http.put('/api/skin/'+skin_req, skin).success(function(data){
				console.log(data);
				$location.path('/skin/'+ skin_req);
			})
			.error(function(status){
				console.log("failed to update with: "+status);
			});
		};

		$scope.cancelUpdate = function(){
			$location.path('/skin/'+ skin_req);
		};

		var googleApiKey = "AIzaSyAsXB9AaNxSIkEh9odUT39Jz35WmrCxwvs";
		$http.get('https://www.googleapis.com/webfonts/v1/webfonts?key='+googleApiKey).success(function(data){
			$scope.googleFonts = data;
			console.log('Loaded google fonts API');
		})
		.error(function(err){
			console.log(err);
		});



});


app.controller('skin-controller', function($scope, $routeParams, $http, $location){
	var skin_req = $routeParams.id;
	$scope.skinID = skin_req;

	$http.get('/api/skin/'+skin_req).success(function(data){
		$scope.skin = data.data;
		console.log('loaded skin');
	})
	.error(function(err){
		console.log(err);
	});

	$scope.editThis = function(){
		$location.path('/edit/'+ skin_req);
	};
	// if($scope.skin.backgroundImage != null){
	// 	console.log($scope.skin.backgroundImage);
	// 	// document.getElementByTag(body).style({'background-image': $scope.skin.backgroundImage});
	// };


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


});


app.controller('font-controller', function($scope, $http){
	//get a list of google fonts
	var googleApiKey = "AIzaSyAsXB9AaNxSIkEh9odUT39Jz35WmrCxwvs";
	$http.get('https://www.googleapis.com/webfonts/v1/webfonts?key='+googleApiKey).success(function(data){
		$scope.googleFonts = data;
		console.log('Loaded google fonts API');
	})
	.error(function(err){
		console.log(err);
	});

	$scope.loadedFontFamily = "Open Sans";
	$scope.loadedFontVariant = "Black";

	$scope.previewFont = function(font, variant){
		$scope.loadedFontFamily = font.family;
		$scope.loadedFontVariant = variant;
	}

	$scope.selectedTab = 'systemFonts';
});



app.controller('auth-controller', function($scope, Auth, $location, $timeout){
    var ref = new Firebase(firebaseURL);
    // var auth = $firebaseAuth(ref);

    Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
    	if(authData){
			$timeout(function(){
				$location.path('templates')
			}, 800)
		}
	});

    $scope.login = function(email, password){
	    ref.authWithPassword({
		  email    : email,
		  password : password
		}, function(error, authData) {
		  if (error) {
		  	$scope.loginError = error.message;
		  	$scope.$apply();
		    console.log("Login Failed!", error.message);

		  } else {
		  	$scope.loading = {'opacity': 0};
		    console.log("Authenticated successfully");
		    $timeout(function(){
		    	$location.path('templates');
		    },2000);
		  }
		});
	}


	$scope.createUser = function(email, password){
		ref.createUser({
			email    : email,
		  	password : password
		}, function(error, userData){
			if(error){
			  	$scope.loginError = error.message;
			  	$scope.$apply();
			}
			else {
				console.log("Created new user "+ userData.uid);
				$scope.login(email, password);
			}
		});
	};

	$scope.logout = function(){
		ref.unauth();
	};



})

app.controller('template-controller', function($scope, Auth, $firebaseAuth, $location){
	var ref = new Firebase(firebaseURL);
    var auth = $firebaseAuth(ref);
   	
   	$scope.logout = function(){
		ref.unauth();
		$location.path('/');
	};

    Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
	});


})








