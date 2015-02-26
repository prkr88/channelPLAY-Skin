var skin = skin; //load in the schema
var firebaseURL = "https://brilliant-heat-8775.firebaseio.com"

//Define angular app
var app = angular.module('app', ['templatescache', 'ngRoute','firebase', 'ui.ace'])

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
			
			.when('/login', {
				templateUrl: 'login.html',
				controller: 'auth-controller'
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
		var ref = new Firebase(firebaseURL);
		$scope.authenticating = true;
		ref.createUser({
			email    : email,
		  	password : password
		}, function(error, userData){
			if(error){
				$scope.authenticating = false;
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

app.controller('templates-controller', function($scope, Auth, $firebase, $location, $timeout){
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


   	$scope.logout = function(){
		Auth.$unauth();
		$timeout(function(){
			$location.path('/');
		}, 300);
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

app.controller('edit-controller', function($scope, $firebase, Auth, $routeParams, $location){
	Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
	    if(authData){
	    	loadTemplate(authData.uid);
	    	// $scope.template.author = $scope.authData.uid;
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

app.controller('view-controller', function($scope, $firebase, $routeParams, $window){
	var id = $routeParams.id;
	var uid = $routeParams.uid;
	var ref = new Firebase(firebaseURL).child('users/'+uid+'/templates/'+id);
	var sync = $firebase(ref);
	var template = sync.$asObject();
	template.$bindTo($scope, 'template');

	angular.element($window).bind('resize', function(){
		
	});


})






