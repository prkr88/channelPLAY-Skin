var express = require('express');
var router = express.Router();
var Skin = require('.././models/Skin');
var bodyParser = require('body-parser');

//root
router.get('/', function(req, res){
	res.send("welcome to our API"); 
});

//create new skin
router.route('/skin')
	.post(function(req, res){
		var skin = new Skin({data: req.body});
		skin.save(function(err){
			if (err)
				res.send(err);
			res.json({id: skin._id});
		});
	})

	.get(function(req, res){
		Skin.find(function(err, skins){
			if(err)
				res.send(err);
			res.json(skins)
		});
	});

//Find skin by ID
router.route('/skin/:skin_id')
	//get an object using it's ID
	.get(function(req, res){
		Skin.findById(req.params.skin_id, function(err, skin){
			if(err)
				res.send(err);
			res.json(skin)
		});
	})

	//update an object using it's ID
	.put(function(req, res){
		Skin.findById(req.params.skin_id, function(err, skin){
			skin.data = req.body;
			skin.save(function(err){
				if(err)
					console.log(err)
				console.log('updated '+ skin._id);
				res.json({id: skin._id});
				})
			})
		})

	//delete an object using it's ID
	.delete(function(req, res) {
        Skin.remove({
            _id: req.params.skin_id
        }, function(err, skin) {
            if (err)
                res.send(err);

            res.json({id: skin._id});
            console.log('deleted '+skin._id);
        });
        console.log("deleted an object");
    });

//make module avaliable to the app
module.exports = router; 
