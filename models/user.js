const mongoose = require('../db/connection');


const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    fiat: {
        THB: { type: Number, default: 0 },
        USD: { type: Number, default: 0 },
    },
    crypto: {
        BTC: { type: Number, default: 0 },
        ETH: { type: Number, default: 0 },
        DOGE: { type: Number, default: 0 },
        XRP: { type: Number, default: 0 },
    },
    
})


const User = new mongoose.model('User', userSchema);

module.exports = User;