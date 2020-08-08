const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user_accountsSchema = new Schema(
  {
    user_id: {
      type: String
    },
    account_number: {
      type: Number
    },
    account_type: {
      type: String
    },
    account_balance: {
      type: Number
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

let user_accounts = mongoose.model("user_accounts", user_accountsSchema);

module.exports = user_accounts;
