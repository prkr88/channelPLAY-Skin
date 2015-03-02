
var firebaseURL = "https://brilliant-heat-8775.firebaseio.com"
var app = angular.module('app', ['templatescache', 'ngRoute','firebase', 'ui.ace'])


//RUNS
app.run(function($rootScope, $location){
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/home");
    }
  });
});

//ROUTES
app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
			
			.when('/login', {
				templateUrl: 'login.html',
				controller: 'authController'
			})

			.when('/templates', {
				templateUrl: 'templates.html',
				controller: 'templatesController',
				resolve: {
			      "currentAuth": ["Auth", function(Auth) {
			        return Auth.$requireAuth();
			      }]
				}
			})

			.when('/template/:uid/:id', {
				templateUrl: 'template.html',
				controller: 'view-controller',
			})

			.when('/edit/:id', {
				templateUrl: 'edit-template.html',
				controller: 'edit-controller',
				resolve: {
			      "currentAuth": ["Auth", function(Auth) {
			        return Auth.$requireAuth();
			      }]
				}
			})

			.otherwise({
				redirectTo: '/login'
			});

		$locationProvider.html5Mode(true);
}]);

//FACTORIES
app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  var ref = new Firebase(firebaseURL);
  return $firebaseAuth(ref);
}]);


//DIRECTIVES
app.directive('globalNav', function(){
	return {
		scope: true,
		restrict: 'E',
		templateUrl: 'app-navigation.html',
		controller: 'authController'
	};
});


//CONTROLLERS
app.controller('authController', function($scope, Auth, $timeout, $location, $firebase){
	Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
		if(authData){
			if($location.$$path === '/login'){
				$timeout(function(){
					$location.path('templates')
				}, 800)
			}
		}
	});

	$scope.logout = function(){
		Auth.$unauth();
		$timeout(function(){
			$location.path('/');
		}, 300);
	};

	$scope.login = function(email, password){
		$scope.authenticating = true;
		Auth.$authWithPassword({email: email, password: password}).then(function(err, authData){
			$scope.loading = {'opacity': 0};
			$timeout(function(){
		    	$location.path('templates');
		    },2000);
		}).catch(function(err) {
      		console.error("Authentication failed: ", err);
      		$scope.authenticating = false;
		  	$scope.$apply();
	    });
	}

	$scope.createUser = function(e, p){
		$scope.authenticating = true;
		var ref = new Firebase(firebaseURL);
		var email = e;
		var password = p;
		ref.createUser({email : email, password : password}, function(err, userData){
			if(err){
				$scope.authenticating = false;
			  	$scope.loginError = err.message;
			  	$scope.$apply();	
			}
			else {
				$scope.loading = {'opacity': 0};
				console.log("Created new user "+ userData.uid);
				$scope.login(email, password)
			}
		});
	};
});




app.controller('templatesController', function($scope, Auth, $location, $firebase, $timeout){
	$scope.templates = [];

    Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
	    if(authData){
	    	syncFirebase(authData.uid);
	    } 
	});

    var syncFirebase = function(uid){
    	var ref = new Firebase(firebaseURL).child('users/'+uid+'/templates');
    	var sync = $firebase(ref);
    	var templatesArray = sync.$asArray();
    	$scope.templates = templatesArray;
    };

    //Checks if there are any templates and displays the welcome text if there aren't any.
    $scope.$watchCollection('templates', function(newVal, oldVal, scope){
		if(newVal.length === 0){
			$scope.noTemplates = true;
		}
		else {
			$scope.noTemplates = false;
		}
    });

	$scope.template = {
		name : "New Template",
		client : "New Client",
		description: "Click edit to customise the content.",
		backgroundUrl : "http://walterlow.com/wp/wp-content/uploads/2013/12/Island.jpg"
	};


	$scope.createNewTemplate = function(){
		$scope.creatingTemplate = true;
		$scope.template.author = $scope.authData.uid;
		$scope.templates.$add($scope.template).then(function(newChildRef){
			$timeout(function(){
				$scope.creatingTemplate = false;
				// $location.path('/edit/'+newChildRef.key());
			}, 800);
		});
	}

	$scope.deleteTemplate = function(index){
		if (confirm('Are you sure? This template will not be recoverable.')) {
		    $scope.templates.$remove(index);
		} else {
		    // Do nothing!
		}
	};
})

app.controller('edit-controller', function($scope, Auth, $routeParams, $firebase, $location, $timeout){
	Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
	    if(authData){
	    	loadTemplate(authData.uid);
	    }
	});

	var loadTemplate = function(uid){
		var id = $routeParams.id;
		var ref = new Firebase(firebaseURL).child('users/'+uid+'/templates/'+id);
		var sync = $firebase(ref);
		var template = sync.$asObject();
		template.$bindTo($scope, 'template');
	};
	

	$scope.$watch('template.navigation.itemString', function(newVal, oldVal){
		if(newVal){
			$scope.template.navigation.items = newVal.split(", ");
		}
	});

})

app.controller('view-controller', function($scope, $firebase, $routeParams, Auth, $location, $timeout){
	var id = $routeParams.id;
	var uid = $routeParams.uid;
	var ref = new Firebase(firebaseURL).child('users/'+uid+'/templates/'+id);
	var sync = $firebase(ref);

	var template = sync.$asObject();
	template.$bindTo($scope, 'template');




	//if the template hasn't loaded in two seconds, redirect to the landing page
	$timeout(function(){
		if($scope.template.$value === null){
			console.log($scope.template + "does not exist, redirecting to home");
			$location.path('/');
		}
	}, 2000)

	Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
	});

})






