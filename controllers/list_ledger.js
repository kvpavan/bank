exports.list_ledger = (req, res) => {
	var Ledger = require('../models/ledger');
	var filter = { }
	if(req.query.user_id){
		filter.user_id = req.query.user_id
	}
	if(req.query.account_number){
		filter.account_number = req.query.account_number
	}
	Ledger.find(filter)
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