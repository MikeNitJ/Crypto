require('dotenv').config();
const mongoose = require('./db/connection');
const User = require('./models/user');
const Transaction = require('./models/transaction');
const Sell = require('./models/sell');

async function seed() {

    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Sell.deleteMany({});

    const user1 = await User.create({
        name: 'Alice',
        username: 'alice',
        password: '1234',
        fiat: { THB: 10000000000, USD: 50000000000 },
        crypto: { BTC: 1000000, ETH: 2000000, DOGE: 10000000, XRP: 5000000 }
    });

    const user2 = await User.create({
        name: 'Bob',
        username: 'bob',
        password: '5678',
        fiat: { THB: 2000000000, USD: 10000000000 },
        crypto: { BTC: 500000, ETH: 100000, DOGE: 5000000, XRP: 200000 }
    });

    await Sell.create({
        user: user1._id,
        BTC: 0.1,
        ETH: 0,
        DOGE: 0,
        XRP: 0,
        fiatType: 'THB',
        price: 150000,
        createdAt: new Date()
    });


    await Transaction.create({
        type: 'transfer',
        fromUser: user1._id,
        toUser: user2._id,
        crypto: { BTC: 0.05, ETH: 0, DOGE: 0, XRP: 0 },
        fiatType: 'THB',
        fiatAmount: 75000,
        exchangeRate: 1500000,
        createdAt: new Date()
    });

    console.log('Seed data completed!');
    mongoose.connection.close();
}

seed();