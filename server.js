//app dependancies
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var reload = require('reload'); //haven't set this up yet. 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; //set port

//API
var apiRoutes = require('./app/routes/apiRoutes');
app.use('/api', apiRoutes);

//STATIC ROUTE
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendfile(__dirname + 'index.html');	
});

//listen for requests
app.listen(port, function() {
  console.log('listening on port '+ port);
});

