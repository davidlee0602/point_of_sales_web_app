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
app.use(bodyParser.json());
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

app.get("/phones", (req, res, next) => {
	var context = {};

  	mysql.pool.query('SELECT * FROM phones',
  		(err, rows, result)=> {
	        if(err) next(err);
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

app.get("/paymentmethods", (req, res, next) => {
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

app.post("/paymentmethods", (req, res, next) => {
  // create new payment method
  let query = `INSERT INTO payment_methods (name) VALUES (?)`;

  mysql.pool.query(query, req.body.name, (err, results, fields) => {
    if (err) next(err);

    res.redirect('paymentmethods');
  });
})

app.get("/new_invoice", (req, res, next) => {
  let context = {};
  context.title = 'AREA 51 - Create New Invoice';

  let phones_query = `SELECT * FROM phones`;
  let carriers_query = `SELECT * FROM carriers`;
  let customers_query = `SELECT * FROM customers`;
  let paymentmethods_query = `SELECT * FROM payment_methods`;

  // query phones, carriers, customers, and payment methods

  new Promise((resolve, reject) => {
      //get phones
      mysql.pool.query(phones_query, (err, results, fields)=>{
        if (err) reject(err);

        let phones = [];
        let phone_detail = {}
        for (let i = 0, k = results.length; i<k; i++) {
          let phone = results[i];
          phone_detail = {};
          phone_detail.id = phone.phone_id;
          phone_detail.name = phone.make + " " + phone.model;
          phone_detail.price = phone.retail_cost;
          phones.push(phone_detail);
        }
        context.phones = phones;
        resolve();
      });
    })
    .then(() => {
      // get carriers
      return new Promise((resolve, reject) => {
        mysql.pool.query(carriers_query, (err, results, fields) => {
          if (err) reject(err);

          let carriers = [];
          let carrier_detail = {};
          for (let i = 0, k = results.length; i<k; i++) {
            let carrier = results[i];
            carrier_detail = {};
            carrier_detail.id = carrier.carrier_id;
            carrier_detail.name = carrier.name;
            carriers.push(carrier_detail);
          }
          context.carriers = carriers;
          resolve();
        })
      })
    })
    .then(() => {
      // get customers
      return new Promise((resolve, reject) => {
        mysql.pool.query(customers_query, (err, results, fields) => {
          if (err) reject(err);

          let customers = [];
          let customer_detail = {};
          for (let i = 0, k = results.length; i<k; i++) {
            let customer = results[i];
            customer_detail = {};
            customer_detail.id = customer.customer_id;
            customer_detail.name = customer.first_name + " " + customer.last_name;
            customers.push(customer_detail);
          }
          context.customers = customers;
          resolve();
        })
      })
    })
    .then(() => {
      // get payment methods
      return new Promise((resolve, reject) => {
        mysql.pool.query(paymentmethods_query, (err, results, fields) => {
          if (err) reject(err);

          let paymentmethods = [];
          let paymentmethod_detail = {};
          for (let i = 0, k = results.length; i<k; i++) {
            let paymentmethod = results[i];
            paymentmethod_detail = {};
            paymentmethod_detail.id = paymentmethod.payment_method_id;
            paymentmethod_detail.name = paymentmethod.name;
            paymentmethods.push(paymentmethod_detail);
          }
          context.paymentmethods = paymentmethods;
          resolve();
        })
      })
    })
    .then(() => {
      // render page
      res.render('new_invoice', context);
    })
    .catch((error) => {
      next(error);
    })

});

app.post("/new_invoice", (req, res, next) => {
  // INSERT INTO invoices (invoice_date, invoice_paid, payment_method_id, customer_id) VALUES (:invoice_date_input, :invoice_paid_input, :payment_method_id_input, :customer_id_input);
  //   /*FOR EACH Phone & Carrier ADDITION*/
  //   /*this_invoice_id_value will store the invoice_id that was created*/
  //   INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (:this_invoice_id_value, :phone_id_dropdown_value, :carrier_id_dropdown_value);
  //   UPDATE invoices
  //     SET total_due = (SELECT IFNULL(SUM(phones.retail_cost), 0.00) FROM phones
  //                       JOIN invoice_details ON phones.phone_id = invoice_details.phone_id
  //                       WHERE invoice_details.invoice_id = (:this_invoice_id_value))
  //     WHERE invoices.invoice_id = (:this_invoice_id_value);

  // SELECT IFNULL(SUM(phones.retail_cost), 0.00) FROM phones JOIN invoice_details ON phones.phone_id = invoice_details.phone_id WHERE invoice_details.invoice_id = 5;

  // queries
  let new_invoice_query =
  `INSERT INTO invoices (invoice_date, invoice_paid, payment_method_id, customer_id)
  VALUES (?, ?, ?, ?)`;

  let new_invoice_details_query =
  `INSERT INTO invoice_details (invoice_id, phone_id, carrier_id)
  VALUES (?, ?, ?);`;

  let update_invoice_total_due_query =
  `UPDATE invoices SET total_due =
  (SELECT IFNULL(SUM(phones.retail_cost), 0.00)
  FROM phones JOIN invoice_details ON phones.phone_id = invoice_details.phone_id
  WHERE invoice_details.invoice_id = ?)
  WHERE invoices.invoice_id = ?`;

  // data
  let invoice_data = {};
  invoice_data.date = req.body.date;
  invoice_data.pay = req.body.pay;
  invoice_data.payment = req.body.payment ? req.body.payment : NULL;
  invoice_data.customer_id = req.body.customer_id;

  let invoice_items = req.body.invoice_items;

  // database actions
  new Promise((resolve, reject) => {
    //create new invoice
    mysql.pool.query(new_invoice_query, [invoice_data.date, invoice_data.pay, invoice_data.payment, invoice_data.customer_id], (err, results, fields) => {
      if (err) next(err);

      let new_invoice_id = results.insertId;
      resolve(new_invoice_id);
    })
  })
  .then((new_invoice_id) => {
    return new Promise((resolve, reject) => {
      //create invoice details (phones and carriers)
      if (Object.entries(invoice_items).length > 0) {
        let promises = [];

        function createInvoiceDetails(invoice_id, phone_id, carrier_id) {
          return new Promise((resolve, reject) => {
            mysql.pool.query(new_invoice_details_query, [new_invoice_id, phone_id, carrier_id], (err, results, fields) => {
              if (err) reject(err);

              resolve();
            })
          })
        }

        // make promise for all invoice_details inserts
        for (let key in invoice_items) {
          promises.push(createInvoiceDetails(new_invoice_id, invoice_items[key].phone_id, invoice_items[key].carrier_id));
        }

        // insert all invoice details at once with Promise.all
        Promise.all(promises)
        .then(() => {
          resolve(new_invoice_id);
        })
        .catch((error) => {
          reject(error);
        });
      }
    });
  })
  .then((new_invoice_id) => {
    return new Promise((resolve, reject) => {
      //update invoice total due
      mysql.pool.query(update_invoice_total_due_query, [new_invoice_id, new_invoice_id], (err, results, fields) => {
        if (err) reject(err);

        resolve();
      })
    })
  })
  .then(() => {
    // return success
    res.json({status: 200});
  })
  .catch((error) => {
    next(error);
  });
})

app.get("/invoices", (req, res, next) => {
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

app.get("/invoice_details", (req, res, next) => {
    res.render('invoice_details');
});

app.get("/edit_invoice", (req, res, next) => {
    let invoices_query;
    res.render('edit_invoice');
});

app.get("/customers", (req, res, next) => {
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

app.post("/customers", (req, res, next) => {
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

app.get("/carriers", (req, res, next) => {
	var context = {};
	mysql.pool.query('SELECT * FROM carriers',
  		(err, rows, result)=> {
	        if(err) next(err);
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
