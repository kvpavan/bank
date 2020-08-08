exports.delete_user = (req, res) => {
        
    var Users = require('../models/users');
	
	console.log({"user_id": req.body.user_id })
	Users.updateOne({user_id: req.body.user_id }, { $set: {"status": 0 } }, function(err, res) {
		if (err){
			console.log(err);
		}  
		console.log("1 document updated", res);
	  });
	  res.json({"status":"success"});
};