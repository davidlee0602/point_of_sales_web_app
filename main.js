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

// handlebars helpers
handlebars.handlebars.registerHelper('formatDate', (dateString) => {
  return new handlebars.SafeString(
    moment(dateString).format('YYYY-MM-DD')
  )
});

app.get("/", (req, res) => {
    res.render('home', {title: 'AREA 51'});
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
    let context = {};
    context.title = 'AREA 51 - Invoices';

    let query =
    `SELECT i.invoice_id, i.invoice_date, i.invoice_paid, i.total_due,
     c.customer_id, c.first_name, c.last_name, p.name
    FROM invoices i
    JOIN customers c ON
    c.customer_id = i.customer_id
    LEFT JOIN payment_methods p ON
    p.payment_method_id = i.payment_method_id`;

    mysql.pool.query(query, (err, results, fields) => {
      if (err) next();
      console.log(results);

      context.rows = results;

      res.render('invoices', context);
    });
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

app.use((req, res) => {
  res.status(404);
  res.render('404');
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render('500');
})

app.listen(app.get('port'), function() {
  console.log("server starting on port", app.get('port'));
})
