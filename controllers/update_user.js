exports.update_user = (req, res) => {
        
    var Users = require('../models/users');
	Users.updateOne({user_id: req.body.user_id }, { $set: {"user_id": req.body.user_id, "name": req.body.name } }, function(err, res) {
		if (err){
			console.log(err);
		}  
		console.log("1 document updated", res);
	  });
	  res.json({"status":"success"});

};