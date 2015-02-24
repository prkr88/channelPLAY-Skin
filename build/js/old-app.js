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
