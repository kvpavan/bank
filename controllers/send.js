var userAccounts = require('../models/user_accounts');
var Users = require('../models/users');
var ledger = require('../models/ledger');
exports.send = (req, res) => {
	var details = req.body;
    selectAccounts(details)
	.then(data=>{
		//console.log(data)
		if(data['sender'].account_balance < details.amount || (data['receiver'].account_type == 'BasicSavings' && (data['receiver'].account_balance+parseInt(details.amount)) > 50000)){
			if(data['sender'].account_balance < details.amount ){
				res.send({"errorCode":"SND005", "errorMessage":"Source account should have the required amount for the transaction to succeed" });
			}
			if(data['receiver'].account_type == 'BasicSavings' && (data['receiver'].account_balance+parseInt(details.amount)) > 50000){
				res.send({"errorCode":"SND006", "errorMessage":"BasicSavings’ account type should never exceed Rs. 50,000" });
			}
		}
		else{
			adjustReceiverAccount(details, data['receiver'])
			.then((receiveBal)=>{
				adjustSenderAccount(details, data['sender'])
				.then((sendBal)=>{
					var ledgerArray = [{"user_id":data['sender'].user_id, "remitter_number":data['receiver'].user_id, "account_number":data['sender'].account_number, "credit":0, "debit":details.amount, "balance":sendBal[1]},
					{"user_id":data['receiver'].user_id, "remitter_number":data['sender'].user_id, "account_number":data['receiver'].account_number, "credit":details.amount, "debit":0, "balance":receiveBal[1]}]
					insertLedger(ledgerArray)
					.then(json=>{
						var timestamp = Math.floor(new Date() / 1000);
						//console.log(data, {"newSrcBalance": data['sender'].account_balance, "totalDestBalance":receiveBal[0], "transferedAt": timestamp});
						res.send({"newSrcBalance": sendBal[1], "totalDestBalance":receiveBal[0], "transferedAt": timestamp})
					})
					.catch(function(error){
						console.error(error);
						res.send(error)
					});   
				})
				.catch(function(error){
					console.error(error);
					res.send(error)
				});   
			})
			.catch(function(error){
				console.error(error);
				res.send(error)
			});   
		}
		
	})
	.catch(function(error){
		console.error(error);
		res.send(error)
	});   

};


var selectAccounts = function(details) {
	return new Promise(function(resolve, reject) {
		userAccounts.find({"account_number": {$in: [details.fromAccountId, details.toAccountId]}, "status":1 })
		.select({})
		.then((data) => {
			if (!data) {
				reject({"errorCode":"SND001", "errorMessage": "User acoounts not found"});
			} 
			if(data.length != 2){
				reject({"errorCode":"SND002", "errorMessage": "Invalid user Accounts"});
			}
			if(data[0].user_id == data[1].user_id){
				reject({"errorCode":"SND003", "errorMessage": "Transfer between accounts belonging to the same user is not allowed"});
			}
			var accDetails = [];
			for (var i=0; i < data.length; i++) {
				
				if(data[i].account_number == details.fromAccountId){
					accDetails['sender'] = data[i];
				}
				else{
					accDetails['receiver'] = data[i];
				}	
				//console.log(accDetails);			
			}
			resolve(accDetails);
		})
		.catch(err => {
			console.log(err)
			reject({"errorCode":"SND004", "errorMessage":"Something went wrong try again"});
		});
	});
}


var adjustReceiverAccount = function(details, data) {
	return new Promise(function(resolve, reject) {
		userAccounts.find({ "user_id": data.user_id, "status": 1 }).then(snapshot => {
			//console.log(snapshot)
			if (snapshot.length == 0) {
			  reject({"errorCode":"SND007", "errorMessage":"User accounts not found" })
		   } else {
				var totalDestBalance = 0;
				var receiverUpdatedBal = 0;
				snapshot.forEach((doc, index, array) => {
					if(data.account_number == doc.account_number){
						//console.log(doc.account_balance)
						doc.account_balance += parseInt(details.amount);
						receiverUpdatedBal = doc.account_balance;
						userAccount = new userAccounts(doc);
						userAccount.save();
					}
					totalDestBalance += doc.account_balance;
					//console.log('balance', totalDestBalance);
					if (index === array.length -1){
						//console.log(totalDestBalance, receiverUpdatedBal);
						resolve([totalDestBalance, receiverUpdatedBal]);
					} 
				})
				
				
			}
		})
		.catch(err => {
			console.log(err)
			reject({"errorCode":"SND008", "errorMessage":"Something went wrong try again"});
		});
	});
}

var adjustSenderAccount = function(details, data) {
	return new Promise(function(resolve, reject) {
		
		userAccounts.find({ "user_id": data.user_id, "status": 1 }).then(snapshot => {
			//console.log(snapshot)
			if (snapshot.length == 0) {
			  reject({"errorCode":"SND007", "errorMessage":"User accounts not found" })
		   } else {
				var totalSourceBalance = 0;
				var senderUpdatedBal = 0;
				snapshot.forEach((doc, index, array) => {
					if(data.account_number == doc.account_number){
						//console.log(doc.account_balance)
						doc.account_balance -= parseInt(details.amount);
						senderUpdatedBal = doc.account_balance;
						userAccount = new userAccounts(doc);
						userAccount.save();
					}
					totalSourceBalance += doc.account_balance;
					//console.log('balance', totalDestBalance);
					if (index === array.length -1) resolve([totalSourceBalance, senderUpdatedBal])
				})
				
				
			}
		})
		.catch(err => {
			console.log(err)
			reject({"errorCode":"SND008", "errorMessage":"Something went wrong try again"});
		});
	});
}


var insertLedger = function(ledgerData) {
	return new Promise(function(resolve, reject) {
		ledgerData.forEach((doc) => {
			//console.log('linsert', doc)
			try{
				Ledger = new ledger(doc);
				Ledger.save();
			}
			catch(err) {
				console.log(err)
				reject({"errorCode":"SND0010", "errorMessage":"Something went wrong try again"});
			};
		})
		resolve({"status":"success"})
	})

};
