const express = require("express");
const connectdb = require("../dbconnect");
const notifications = require("../models/notifications");

const router = express.Router();

router.route("/").get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  var filter = req.query.filter || {};

  connectdb.then(db => {
    notifications.find(filter).sort({createdAt:-1}).then(notifications => {      
      res.header('Access-Control-Allow-Origin', "*");
      res.header('Access-Control-Allow-Headers', "*");
      res.json(notifications);
    });
  });
});

module.exports = router;
