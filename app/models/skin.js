//API schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/skin');

var skinSchema = new Schema({
	 data: Object
}, { strict: false });

module.exports = mongoose.model('Skin', skinSchema);