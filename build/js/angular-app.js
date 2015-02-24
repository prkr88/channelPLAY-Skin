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
				controller: 'templates-controller',
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

		$locationProvider.html5Mode(true);
}]);

app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  var ref = new Firebase(firebaseURL);
  // console.log("running factory");
  return $firebaseAuth(ref);
}]);


//FIREBASE APP CONTROLLERS

app.controller('auth-controller', function($scope, Auth, $location, $timeout){
    Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
    	if(authData){
			$timeout(function(){
				$location.path('templates')
			}, 800)
		}
	});

    $scope.login = function(email, password){
    	var ref = new Firebase(firebaseURL);
    	$scope.authenticating = true;

	    ref.authWithPassword({
		  email    : email,
		  password : password
		}, function(error, authData) {
		  if (error) {
		  	$scope.authenticating = false;
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
		Auth.$unauth();
	};



})

app.controller('templates-controller', function($scope, Auth, $firebase, $firebaseAuth, $location, $timeout){
	$scope.loading = true;

    Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
	    // console.log($scope.authData);
	    if(authData){
	    	syncFirebase(authData.uid);
	    } 
	});

    var syncFirebase = function(uid){
    	var ref = new Firebase(firebaseURL).child('users/'+uid+'/templates');
    	var sync = $firebase(ref);
    	var templatesArray = sync.$asArray();
    	$scope.templates = templatesArray;
    	if($scope.templates.length === 0){
    		$scope.noTemplates = true;
    	}
    }


   	$scope.logout = function(){
		Auth.$unauth();
		$timeout(function(){
			$location.path('/');
		}, 300);
	};


    $scope.newEntry = function(word){
	    templates.$push({hello: word}).then(function(newChildRef) {
  			console.log("added record with id " + newChildRef.key());
  		})
	}


	//helper functions
	$scope.addNew = function(){
		$scope.template.author = $scope.authData.uid;
		$scope.templates.$add($scope.template).then(function(newChildRef){
			console.log("added new record: "+newChildRef.key());
		});
		$scope.template = '';
	};



})








