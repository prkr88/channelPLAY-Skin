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

    Auth.$onAuth(function(authData) {
	    $scope.authData = authData;
	    // console.log($scope.authData);
	    if(authData){
	    	syncFirebase(authData.uid);
	    	defineSchema();
	    } 
	});

    var syncFirebase = function(uid){
    	var ref = new Firebase(firebaseURL).child('users/'+uid+'/templates');
    	var sync = $firebase(ref);
    	var templatesArray = sync.$asArray();
    	$scope.templates = templatesArray;
    	$timeout(function(){
    		if($scope.templates.length === 0){
    			$scope.noTemplates = true;
    		}
    	}, 1000);
    };

    var defineSchema = function(){
    	//define creation schema here
		$scope.template = {
			author : $scope.authData.uid,
			name : "Placeholder Name",
			client : "Placeholder Client",
			description: "Edit the template to setup a description, and customise the content.",
			hero : {
				imageUrl : "http://walterlow.com/wp/wp-content/uploads/2013/12/Island.jpg"
			}
		};
    }

   	$scope.logout = function(){
		Auth.$unauth();
		$timeout(function(){
			$location.path('/');
		}, 300);
	};

	$scope.createNewTemplate = function(){
		$scope.creatingTemplate = true;
		$scope.templates.$add($scope.template).then(function(newChildRef){
			$timeout(function(){
				$location.path('/edit/'+newChildRef.key());
			}, 1200);
		});
	}

	//helper functions
	$scope.addNew = function(){
		$scope.template.author = $scope.authData.uid;
		$scope.templates.$add($scope.template).then(function(newChildRef){
			console.log("added new record: "+newChildRef.key());
		});
		$scope.template = '';
	};

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
})

app.controller('view-controller', function($scope, $firebase, $routeParams){
	var id = $routeParams.id;
	var uid = $routeParams.uid;

	var ref = new Firebase(firebaseURL).child('users/'+uid+'/templates/'+id);
	var sync = $firebase(ref);
	var template = sync.$asObject();
	template.$bindTo($scope, 'template');


})






