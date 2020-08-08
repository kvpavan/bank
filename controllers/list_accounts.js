exports.list_accounts = (req, res) => {
	var UserAccounts = require('../models/user_accounts');
	var filter = {"status":1 }
	if(req.query.user_id){
		filter.user_id = req.query.user_id
	}
	UserAccounts.find(filter)
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