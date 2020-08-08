const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    user_id: {
      type: String
    },
    name: {
      type: String
    },
    status: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

let users = mongoose.model("users", usersSchema);

module.exports = users;
