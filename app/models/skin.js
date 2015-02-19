//API schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/skin');

var skinSchema = new Schema({
	 name: String
	,url: String
	,desc: String
});

module.exports = mongoose.model('Skin', skinSchema);