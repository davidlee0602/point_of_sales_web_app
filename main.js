// main.js
let express = require('express');
let mysql = require('./dbcon.js');
let app = express();
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
const dotenv = require('dotenv');
dotenv.config();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT);
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/phones", (req, res) => {
    res.render('phones');
});

app.get("/paymentmethods", (req, res) => {
    res.render('paymentmethods');
});

app.get("/new_invoice", (req, res) => {
    res.render('new_invoice');
});

app.get("/invoices", (req, res) => {
    res.render('invoices');
});

app.get("/invoice_details", (req, res) => {
    res.render('invoice_details');
});

app.get("/edit_invoice", (req, res) => {
    res.render('edit_invoice');
});

app.get("/customers", (req, res) => {
    res.render('customers');
});

app.get("/carriers", (req, res) => {
    res.render('carriers');
});

app.get("/about", (req, res) => {
    res.render('about');
});
