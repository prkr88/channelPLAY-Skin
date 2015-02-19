var express = require('express');
var router = express.Router();
var Skin = require('.././models/Skin');
var bodyParser = require('body-parser');
var router = express.Router();

//root
router.get('/', function(req, res){
	res.send("welcome to our API"); 
		// {"GET All skins": "/skin"}, 
		// {"POST new skin": "/skin"}, 
		// {"GET a specific skin": "/skin/skin_id"},
		// {"PUT a specific skin": "/skin/skin_id"},
		// {"DELETE a specific skin": "/skin/skin_id"}');
});

//create new skin
router.route('/skin')
	.post(function(req, res){
		var skin = new Skin();
		skin.name = req.body.name;
		skin.url = req.body.url;
		skin.desc = req.body.desc; //save the whole thing for now, no validation
		skin.save(function(err){
			if (err)
				res.send(err);
			res.json({message: 'Created new skin!'});
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
			if(err)
				res.send(err)

			//only updates fields that have updated
			if(req.body.name)
				skin.name = req.body.name;
			if(req.body.url)
				skin.url = req.body.url;
			if(req.desc)
				skin.desc = req.body.desc;
			skin.save(function(err){
				if(err)
					res.send(err)
				res.json({message: 'Updated'});
			});
		});
	})

	//delete an object using it's ID
	.delete(function(req, res) {
        Skin.remove({
            _id: req.params.skin_id
        }, function(err, skin) {
            if (err)
                res.send(err);

            res.json({ message: 'Deleted' });
        });
        console.log("deleted an object");
    });

//make module avaliable to the app
module.exports = router; 
