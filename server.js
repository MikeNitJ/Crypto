require('dotenv').config();
const express = require ('express');
const app = express();
const PORT = process.env.PORT || 8000;

const expressLayouts = require("express-ejs-layouts");
const authRoutes = require('./controllers/authController');
const userRoutes = require('./controllers/userController');
const session = require("express-session");


app.set('view engine', 'ejs');
//middleware
app.use(express.static('public'));
app.use (expressLayouts);

app.use(session({secret: "Secret I guess", cookie: {maxAge: 3600000000},}));
//to use form data
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("home.ejs")
});

function authCheck(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

app.use(authRoutes)
app.use(authCheck, userRoutes)

app.listen(PORT, () => console.log(" Hello it's me", PORT))