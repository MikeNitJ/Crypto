const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/login", (req, res) =>{
    res.render("auth/login.ejs")
})
router.post("/login", async (req, res) =>{

    let userToLogin = await User.findOne({ username: req.body.username, password: req.body.password });
    
    if(userToLogin){
        if(userToLogin.password === req.body.password){
            req.session.userId = userToLogin._id;
            console.log(req.session.userId);
            
            // res.send("You are logged in!");
            res.redirect("/main");
        }else {
            res.send("Incorrect password");
        }
    }
    
    })
    
    
    router.get("/signup", (req, res) =>{
        res.render("auth/signup.ejs")
    })
    
    router.post("/signup", async (req, res) =>{
        
        if (req.body.username && req.body.password){
            let newUser = await User.create(req.body)
            
            console.log("this is from signup when you create new user",newUser);
            res.redirect("/");
        }
        })
    

module.exports = router;