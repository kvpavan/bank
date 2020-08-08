exports.save_user = (req, res) => {
        
    var Users = require('../models/users');
	User = new Users(req.body);
	User.save();
	res.send(User);
};