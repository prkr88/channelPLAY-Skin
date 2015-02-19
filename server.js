//app dependancies
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongo = require('mongodb');


//start mongoDB if it's not already running
mongoose.connection.on('error', function (err) {
	var sys = require('sys')
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { sys.puts(stdout) }
	exec("mongod --dbpath db", puts);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; //set port

//API
var apiRoutes = require('./app/routes/apiRoutes');
app.use('/api', apiRoutes);


//Serve the static file
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendfile(__dirname + 'index.html');	
});

//listen for requests
app.listen(port, function() {
  console.log('listening on port '+ port);
});

