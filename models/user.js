const mongoose = require('../db/connection');


const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    fiat: {
        THB: { type: Number, default: 500000000 },
        USD: { type: Number, default: 500000000 },
    },
    crypto: {
        BTC: { type: Number, default: 1000000 },
        ETH: { type: Number, default: 1000000 },
        DOGE: { type: Number, default: 1000000 },
        XRP: { type: Number, default: 1000000 },
    },
    
})


const User = new mongoose.model('User', userSchema);

module.exports = User;