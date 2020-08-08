const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ledgerSchema = new Schema(
  {
    user_id: {
      type: String
    },
    account_number: {
      type: String
    },
    remitter_number: {
      type: String
    },
    credit: {
      type: Number
    },
    debit: {
      type: Number
    },    
    balance: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

let ledger = mongoose.model("ledger", ledgerSchema);

module.exports = ledger;
