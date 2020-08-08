//require the express module
const express = require("express");
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb+srv://pavan1:rlpwZEcp6qav0dlZ@cluster0-luxi8.mongodb.net/bank?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.Promise = global.Promise;
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const routes = require("./routes/router");

//require the http module
const http = require("http").Server(app);

const port = 5001;

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//middleware validation for account create
app.use('/api/users/create_account', (req, res, next)=>{
  //console.log(req.body);
  var UserAccounts = require('./models/user_accounts');
	var filter = {"status":1 }
	if(req.body.account_type){
		filter.account_type = req.body.account_type
  }
  if(req.body.user_id){
		filter.user_id = req.body.user_id
  }
  UserAccounts
  .countDocuments(filter, function(error, count){
    console.log(count);
    if(count){
      res.json({"status":"failed", "message":"102: For account type already exist for user"});
    }
    else{      
      if(req.body.account_type == 'BasicSavings' && req.body.account_balance > 50000){
        res.json({"status":"failed", "message":"101: For Basic Savings account balnce should be less than 50000"});
      }
      else{
        next();
      }
    }
  });
  
})

//routes
app.use(routes);


//set the express.static middleware
app.use('/', express.static(__dirname + "/public"));

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
