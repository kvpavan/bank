exports.create_account = (req, res) => {
        
    var Accounts = require('../models/user_accounts');
	Account = new Accounts(req.body);
	Account.save();
	var ledger = require('../models/ledger');
	//console.log({"user_id":req.body.user_id, "account_number":req.body.account_number, "credit":req.body.account_balance, "debit":0, "balance":req.body.account_balance})
	Ledger = new ledger({"user_id":req.body.user_id, "remitter_number":"InitBal", "account_number":req.body.account_number, "credit":req.body.account_balance, "debit":0, "balance":req.body.account_balance});
	Ledger.save();
	res.send(Account);
};