const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Sell = require('../models/sell');
const Transaction = require('../models/transaction');
const exchangeRate = {
    USD : { BTC: 50000,ETH: 4000,DOGE: 0.2,XRP: 1},
    THB : { BTC: 1500000,ETH: 120000,DOGE: 6,XRP: 30}
};



router.get("/main", async (req, res) => {
    const user = await User.findById(req.session.userId);

 
    res.render("currency/main.ejs", {
        fiat: user.fiat,
        crypto: user.crypto,
    }) 
    console.log("this is main page send from userController");

})


router.post("/sell", async (req, res) => {
    const user = await User.findById(req.session.userId);

    const BTC = req.body.BTC ? Number(req.body.BTC) : 0;
    const ETH = req.body.ETH ? Number(req.body.ETH) : 0;
    const DOGE = req.body.DOGE ? Number(req.body.DOGE) : 0;
    const XRP = req.body.XRP ? Number(req.body.XRP) : 0;
    
    const newSell = await Sell.create({
        user: user._id,
        BTC,
        ETH,
        DOGE,
        XRP
    });
     res.redirect("/tradelist");
});


router.get("/tradelist", async (req, res) => {

    
    const sells = await Sell.find().populate('user');
    res.render("currency/tradelist.ejs", {
     
        sells
        
    })
    console.log("Hello it's sell",sells);
})


router.post("/buy", async (req, res) => {
    
    const { sellId, typeExchangeRate } = req.body;
    
    const sell = await Sell.findById(req.body.sellId).populate('user');
    const buyer = await User.findById(req.session.userId);

    const rate = exchangeRate[typeExchangeRate];
    const sellPrice = (sell.BTC*rate.BTC) + (sell.ETH*rate.ETH) + (sell.DOGE*rate.DOGE) + (sell.XRP*rate.XRP);
    
    if( typeExchangeRate === "USD") {
        if (buyer.fiat.USD < sellPrice) {
            return res.status(400).send("Insufficient funds");
        }
            newBuyerBalance = buyer.fiat.USD - sellPrice;
            await User.findByIdAndUpdate(buyer._id, { "fiat.USD": newBuyerBalance });

            newSellerBalance = sell.user.fiat.USD + sellPrice;
            await User.findByIdAndUpdate(sell.user._id, { "fiat.USD": newSellerBalance });

              newBuyerCrypto = {
                BTC: (buyer.crypto.BTC || 0) + sell.BTC,
                ETH: (buyer.crypto.ETH || 0) + sell.ETH,
                DOGE: (buyer.crypto.DOGE || 0) + sell.DOGE,
                XRP: (buyer.crypto.XRP || 0) + sell.XRP
            };

            newSellerCrypto = {
                BTC: (sell.user.crypto.BTC || 0) - sell.BTC,
                ETH: (sell.user.crypto.ETH || 0) - sell.ETH,
                DOGE: (sell.user.crypto.DOGE || 0) - sell.DOGE,
                XRP: (sell.user.crypto.XRP || 0) - sell.XRP
                
                
            };
            await User.findByIdAndUpdate(buyer._id, {
                "crypto.BTC": newBuyerCrypto.BTC,
                "crypto.ETH": newBuyerCrypto.ETH,
                "crypto.DOGE": newBuyerCrypto.DOGE,
                "crypto.XRP": newBuyerCrypto.XRP
            });
            await User.findByIdAndUpdate(sell.user._id, {
                "crypto.BTC": newSellerCrypto.BTC,
                "crypto.ETH": newSellerCrypto.ETH,
                "crypto.DOGE": newSellerCrypto.DOGE,
                "crypto.XRP": newSellerCrypto.XRP
            });
            console.log("Buyercrypto",newBuyerCrypto,"and Sellercrypto", newSellerCrypto);

        }

    if( typeExchangeRate === "THB") {
        if (buyer.fiat.THB < sellPrice) {
            return res.status(400).send("Insufficient funds");
        }
            newBuyerBalance = buyer.fiat.THB - sellPrice;
            await User.findByIdAndUpdate(buyer._id, { "fiat.THB": newBuyerBalance });

            newSellerBalance = sell.user.fiat.THB + sellPrice;
            await User.findByIdAndUpdate(sell.user._id, { "fiat.THB": newSellerBalance });

            newBuyerCrypto = {
                BTC: (buyer.crypto.BTC || 0) + sell.BTC,
                ETH: (buyer.crypto.ETH || 0) + sell.ETH,
                DOGE: (buyer.crypto.DOGE || 0) + sell.DOGE,
                XRP: (buyer.crypto.XRP || 0) + sell.XRP
            };

            newSellerCrypto = {
                BTC: (sell.user.crypto.BTC || 0) - sell.BTC,
                ETH: (sell.user.crypto.ETH || 0) - sell.ETH,
                DOGE: (sell.user.crypto.DOGE || 0) - sell.DOGE,
                XRP: (sell.user.crypto.XRP || 0) - sell.XRP
            };
            await User.findByIdAndUpdate(buyer._id, {
                "crypto.BTC": newBuyerCrypto.BTC,
                "crypto.ETH": newBuyerCrypto.ETH,
                "crypto.DOGE": newBuyerCrypto.DOGE,
                "crypto.XRP": newBuyerCrypto.XRP
            });
            await User.findByIdAndUpdate(sell.user._id, {
                "crypto.BTC": newSellerCrypto.BTC,
                "crypto.ETH": newSellerCrypto.ETH,
                "crypto.DOGE": newSellerCrypto.DOGE,
                "crypto.XRP": newSellerCrypto.XRP
            });

            console.log(newBuyerCrypto, newSellerCrypto);
            
    }
        await Sell.findByIdAndDelete(sellId);

        await Transaction.create({
            type: 'buy',
            fromUser: sell.user._id,
            toUser: buyer._id,
            crypto: {
                BTC: sell.BTC,
                ETH: sell.ETH,
                DOGE: sell.DOGE,
                XRP: sell.XRP
            },
            cryptoAmount: sell.BTC + sell.ETH + sell.DOGE + sell.XRP, 
            fiatType: typeExchangeRate,
            fiatAmount: sellPrice,
            exchangeRate: rate, 
            createdAt: new Date()
        });

        console.log("Buy transaction completed successfully");
        res.redirect("/main");
})


router.post("/transfer", async (req, res) => {
    const { name, BTC, ETH, DOGE, XRP } = req.body;
    const fromUser = await User.findById(req.session.userId);
    const toUser = await User.findOne({name});

    if (!toUser) {
        return res.status(400).send("Recipient not found");
    }

    fromUserCrypto = {
        BTC: fromUser.crypto.BTC || 0,
        ETH: fromUser.crypto.ETH || 0,
        DOGE: fromUser.crypto.DOGE || 0,
        XRP: fromUser.crypto.XRP || 0
    };
    toUserCrypto = {
        BTC: toUser.crypto.BTC || 0,
        ETH: toUser.crypto.ETH || 0,
        DOGE: toUser.crypto.DOGE || 0,
        XRP: toUser.crypto.XRP || 0
    }; 
    if (fromUserCrypto.BTC < BTC || fromUserCrypto.ETH < ETH || fromUserCrypto.DOGE < DOGE || fromUserCrypto.XRP < XRP) {
        return res.status(400).send("Insufficient funds");
    }
    fromUserCrypto.BTC = fromUserCrypto.BTC - BTC;
    fromUserCrypto.ETH = fromUserCrypto.ETH - ETH;
    fromUserCrypto.DOGE = fromUserCrypto.DOGE - DOGE;
    fromUserCrypto.XRP = fromUserCrypto.XRP - XRP;

    toUserCrypto.BTC = toUserCrypto.BTC + BTC;
    toUserCrypto.ETH = toUserCrypto.ETH + ETH; 
    toUserCrypto.DOGE = toUserCrypto.DOGE + DOGE;
    toUserCrypto.XRP = toUserCrypto.XRP + XRP;

    await User.findByIdAndUpdate(fromUser._id, {
        "crypto.BTC": fromUserCrypto.BTC,
        "crypto.ETH": fromUserCrypto.ETH,
        "crypto.DOGE": fromUserCrypto.DOGE,
        "crypto.XRP": fromUserCrypto.XRP
    });

    await User.findByIdAndUpdate(toUser._id, {
        "crypto.BTC": toUserCrypto.BTC,
        "crypto.ETH": toUserCrypto.ETH,
        "crypto.DOGE": toUserCrypto.DOGE,
        "crypto.XRP": toUserCrypto.XRP
    });

    await Transaction.create({
        type: 'transfer',
        fromUser: fromUser._id,
        toUser: toUser._id,
        crypto: {
            BTC: Number(BTC),
            ETH: Number(ETH),
            DOGE: Number(DOGE),
            XRP: Number(XRP)
        },
        createdAt: new Date()
    });
    res.redirect("/main");
})

router.get("/transaction", async (req, res) => {
    const transactions = await Transaction.find().populate('fromUser toUser') 

    res.render("currency/transaction.ejs", { transactions });
});



module.exports = router;

