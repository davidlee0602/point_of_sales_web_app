// main.js
// let moment = require('moment');
let express = require('express');
let mysql = require('./dbcon.js');
let bodyParser = require('body-parser');
let app = express();
const dotenv = require('dotenv');
dotenv.config();

let handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT);
app.use(express.static('public'));

// handlebars helpers
// handlebars.handlebars.registerHelper('formatDate', (dateString) => {
//   return new handlebars.SafeString(
//     moment(dateString).format('YYYY-MM-DD')
//   )
// });

app.get("/", (req, res) => {
    res.render('home', {title: 'AREA 51'});
});

app.get("/phones", (req, res) => {
	var context = {};

  	mysql.pool.query('SELECT * FROM phones',
  		(err, rows, result)=> {
	        if(err) throw err;
	        var storage = [];
	        for(var i in rows){
	            storage.push({"make": rows[i].make, "model": rows[i].model, "image": rows[i].image_url, "purchase": rows[i].purchase_cost, "retail": rows[i].retail_cost})
	        }
	        context.results = storage;
         	res.render('phones', context);
    	});
});

app.get("/add_phone", (req, res, next) => {
	var context = {};
	mysql.pool.query('INSERT INTO phones (`make`,`model`,`image_url`,`purchase_cost`,`retail_cost`) VALUES (?,?,?,?,?)',
  		[req.query.make, req.query.model, req.query.image_url, req.query.purchase_cost, req.query.retail_cost],
  		function(err, result){
		    if(err){
		      next(err);
		      return;
		    }
		    context.make = req.query.make;
		    context.model = req.query.model;
		    context.image_url = req.query.image_url;
		    context.purchase_cost = req.query.purchase_cost;
		    context.retail_cost = req.query.retail_cost;
		    res.redirect('/phones');
	  	});
});

app.get("/paymentmethods", (req, res) => {
    // show all payment methods
    let context = {}
    context.title = 'AREA 51 - Payment Methods';

    let query = `SELECT * FROM payment_methods`;

    mysql.pool.query(query, (err, results, fields) => {
      if (err) next(err);

      context.rows = results;

      res.render('paymentmethods', context);
    })
});

app.post("/paymentmethods", (req, res) => {
  // create new payment method
  let query = `INSERT INTO payment_methods (name) VALUES (?)`;

  mysql.pool.query(query, req.body.name, (err, results, fields) => {
    if (err) next(err);

    res.redirect('paymentmethods');
  });
})

app.get("/new_invoice", (req, res) => {
    res.render('new_invoice');
});

app.get("/invoices", (req, res) => {
    // show all invoices and accompanying data
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
      if (err) next(err);

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
  //show all customers
  let context = {};
  context.title = 'AREA 51 - Customers';

  let query = `SELECT * FROM customers;`;

  mysql.pool.query(query, (err, results, fields) => {
    if (err) next(err);

    context.rows = results;

    res.render('customers', context);
  });
});

app.post("/customers", (req, res) => {
  // create new customer
  let data = [
    req.body.fname,
    req.body.lname,
    req.body.street,
    req.body.city,
    req.body.state,
    req.body.zip,
    req.body.phone,
    req.body.email
  ]

  let query =
  `INSERT INTO customers
  (first_name, last_name, street, city, state, zip, phone, email)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  mysql.pool.query(query, data, (err, results, fields) => {
    if (err) next(err);
    res.redirect('/customers');
  })
});

app.get("/carriers", (req, res) => {
	var context = {};
	mysql.pool.query('SELECT * FROM carriers',
  		(err, rows, result)=> {
	        if(err) throw err;
	        var storage = [];
	        for(var i in rows){
	            storage.push({"name": rows[i].name})
	        }
	        context.results = storage;
         	res.render('carriers', context);
    	});
});

app.get("/add_carrier", (req, res, next) => {
	var context = {};
	mysql.pool.query('INSERT INTO carriers (`name`) VALUES (?)',
  		[req.query.name],
  		function(err, result){
		    if(err){
		      next(err);
		      return;
		    }
		    context.name = req.query.name;
		    res.redirect('/carriers');
	  	});
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
