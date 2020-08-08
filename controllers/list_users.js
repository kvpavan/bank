exports.list_users = (req, res) => {
        
    var Users = require('../models/users');
	Users.find({"status":1})
	.select()
	.then((data) => {
        if (!data) {
          res.status(400).json({error});
	} else {
		//console.log(data)
	   res.status(200).json({data});
	}  
    }).catch(err => {
		console.log('Could not connect to the database. Exiting now...'+err);
		process.exit();
	});
};