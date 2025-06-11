const mongoose = require('../db/connection');


const sellSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  BTC: { type: Number, default: 0 },
  ETH: { type: Number, default: 0 },
  DOGE: { type: Number, default: 0 },
  XRP: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sell', sellSchema);