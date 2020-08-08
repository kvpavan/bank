const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

// const url = "mongodb://localhost:27017/chat";
const url = "mongodb+srv://pavan1:rlpwZEcp6qav0dlZ@cluster0-luxi8.mongodb.net/socket?retryWrites=true&w=majority";

const connect = mongoose.connect(url, { useNewUrlParser: true });

module.exports = connect;
