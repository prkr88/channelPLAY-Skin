var express = require('express');
var router = express.Router();
var app = express();
// var bodyParser = require('body-parser');


router.get('/', function(req, res){
	app.use(express.static(__dirname + './public'));
	res.sendfile(__dirname + './public/index.html');
	console.log('App launched');
	});


module.exports = router;