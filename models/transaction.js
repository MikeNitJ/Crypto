const mongoose = require('../db/connection');


const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['buy', 'sell', 'transfer'], required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  crypto: { 
    BTC: { type: Number, default: 0 },
    ETH: { type: Number, default: 0 },
    DOGE: { type: Number, default: 0 },
    XRP: { type: Number, default: 0 }
  },
  
  fiatType: { type: String, enum: ['THB', 'USD'] },
  fiatAmount: Number,
  exchangeRate: { 
    BTC: Number,
    ETH: Number,
    DOGE: Number,
    XRP: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);