-- Area 51 Phone Emporium

-- *** Data Definition Queries ***
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `phones`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `invoice_details`;
DROP TABLE IF EXISTS `payment_methods`;
DROP TABLE IF EXISTS `carriers`;
SET FOREIGN_KEY_CHECKS=1;

-- phones
CREATE TABLE phones (
  phone_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, /*removed UNIQUE due to conflict with PRIMARY KEY */
  make VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  purchase_cost DECIMAL(20, 2) NOT NULL,
  retail_cost DECIMAL(20, 2) NOT NULL
)ENGINE=InnoDB;

-- customers
CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip int NOT NULL,
  phone VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
)ENGINE=InnoDB;

-- payment methods
CREATE TABLE payment_methods (
  payment_method_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
)ENGINE=InnoDB;

-- carriers
CREATE TABLE carriers (
  carrier_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
)ENGINE=InnoDB;

-- invoices
CREATE TABLE invoices (
  invoice_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  invoice_date DATE NOT NULL, /*Changed date to invoice_date due to reserved keyword conflict */
  total_due DECIMAL(20, 2) DEFAULT '0.00', /*Changed NOT NULL to DEFAULT '0.00' due to circular reference in the initial insert into invoices */
  invoice_paid BOOLEAN NOT NULL DEFAULT false,
  payment_method_id INT,
  customer_id INT NOT NULL,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods (payment_method_id)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
  ON DELETE NO ACTION
  ON UPDATE CASCADE
)ENGINE=InnoDB;

-- invoice details
CREATE TABLE invoice_details (
  invoice_detail_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  invoice_id INT NOT NULL,
  phone_id INT NOT NULL,
  carrier_id INT NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  FOREIGN KEY (phone_id) REFERENCES phones(phone_id)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES carriers(carrier_id)
  ON DELETE NO ACTION
  ON UPDATE CASCADE
)ENGINE=InnoDB;

-- *** Sample Data ***

-- phones
INSERT INTO phones (make, model, image_url, purchase_cost, retail_cost) VALUES ('Apple', 'iPhone 11', '/phone_iphone11.jpg', '600.00', '699.99');

INSERT INTO phones (make, model, image_url, purchase_cost, retail_cost) VALUES ('Apple', 'iPhone 11 Pro', '/phone_iphone11pro.jpg', '900.00', '999.99');

INSERT INTO phones (make, model, image_url, purchase_cost, retail_cost) VALUES ('Samsung', 'Galaxy S10', '/phone_galaxys10.jpg', '700.00', '799.99');

INSERT INTO phones (make, model, image_url, purchase_cost, retail_cost) VALUES ('Samsung', 'Galaxy S10+', '/phone_galaxynote10plus.jpg', '1200.00', '1299.99');

-- customers
INSERT INTO customers (first_name, last_name, street, city, state, zip, phone, email) VALUES ('Uchiha', 'Chang', '123 Pink Cage', 'Los Santos', 'CA', 90000, '111-222-3333', 'mr.chang@changsdojo.com');

INSERT INTO customers (first_name, last_name, street, city, state, zip, phone, email) VALUES ('Taco', 'Prince', '124 Hollywod Blvd', 'Los Santos', 'CA', 90001, '111-345-5555', 'realtaco@changsdojo.com');

INSERT INTO customers (first_name, last_name, street, city, state, zip, phone, email) VALUES ('Vinny', 'Pistone', '510 Park Ave', 'Los Santos', 'CA', 90002, '111-789-1000', 'vinnypistone@changsdojo.com');

INSERT INTO customers (first_name, last_name, street, city, state, zip, phone, email) VALUES ('Dequarius', 'Johnson', '997 Misson Row', 'Los Santos', 'CA', 90005, '111-637-9887', 'bigD@changsdojo.com');

-- payment methods
INSERT INTO payment_methods (name) VALUES ('Cash');

INSERT INTO payment_methods (name) VALUES ('Credit');

INSERT INTO payment_methods (name) VALUES ('Debit');

INSERT INTO payment_methods (name) VALUES ('PayPal');

-- carriers
INSERT INTO carriers (name) VALUES ('T-Mobile');

INSERT INTO carriers (name) VALUES ('Verizon');

INSERT INTO carriers (name) VALUES ('AT&T');

INSERT INTO carriers (name) VALUES ('Sprint');

-- invoices
INSERT INTO invoices (invoice_date, invoice_paid, payment_method_id, customer_id) VALUES
  ('2020-01-03', '1',
    (SELECT payment_methods.payment_method_id FROM payment_methods WHERE payment_methods.name = 'Cash'),
    (SELECT customers.customer_id FROM customers WHERE first_name = 'Uchiha' AND last_name = 'Chang'));

INSERT INTO invoices (invoice_date, invoice_paid, payment_method_id, customer_id) VALUES
  ('2020-01-10', '1',
    (SELECT payment_methods.payment_method_id FROM payment_methods WHERE payment_methods.name = 'Credit'),
    (SELECT customers.customer_id FROM customers WHERE first_name = 'Taco' AND last_name = 'Prince'));

INSERT INTO invoices (invoice_date, invoice_paid, payment_method_id, customer_id) VALUES
  ('2020-01-17', '1',
    (SELECT payment_methods.payment_method_id FROM payment_methods WHERE payment_methods.name = 'Debit'),
    (SELECT customers.customer_id FROM customers WHERE first_name = 'Vinny' AND last_name = 'Pistone'));

INSERT INTO invoices (invoice_date, invoice_paid, customer_id) VALUES
  ('2020-01-24', '0',
    (SELECT customers.customer_id FROM customers WHERE first_name = 'Dequarius' AND last_name = 'Johnson'));

-- invoice details
-- chang's phones (3 phones)
INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Uchiha' AND last_name = 'Chang' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Apple' AND model = 'iPhone 11 Pro'),
    (SELECT carrier_id FROM carriers WHERE name = 'Verizon')
);

INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Uchiha' AND last_name = 'Chang' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Apple' AND model = 'iPhone 11'),
    (SELECT carrier_id FROM carriers WHERE name = 'Verizon')
);

INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Uchiha' AND last_name = 'Chang' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Samsung' AND model = 'Galaxy S10+'),
    (SELECT carrier_id FROM carriers WHERE name = 'Verizon')
);


-- taco's phones (2 phones)
INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Taco' AND last_name = 'Prince' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Apple' AND model = 'iPhone 11'),
    (SELECT carrier_id FROM carriers WHERE name = 'T-Mobile')
);

INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Taco' AND last_name = 'Prince' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Samsung' AND model = 'Galaxy S10+'),
    (SELECT carrier_id FROM carriers WHERE name = 'Sprint')
);

-- vinny's phones (4 phones)
INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Vinny' AND last_name = 'Pistone' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Apple' AND model = 'iPhone 11 Pro'),
    (SELECT carrier_id FROM carriers WHERE name = 'T-Mobile')
);

INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Vinny' AND last_name = 'Pistone' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Apple' AND model = 'iPhone 11 Pro'),
    (SELECT carrier_id FROM carriers WHERE name = 'Sprint')
);

INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Vinny' AND last_name = 'Pistone' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Apple' AND model = 'iPhone 11 Pro'),
    (SELECT carrier_id FROM carriers WHERE name = 'AT&T')
);

INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Vinny' AND last_name = 'Pistone' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Apple' AND model = 'iPhone 11 Pro'),
    (SELECT carrier_id FROM carriers WHERE name = 'Verizon')
);

-- bigD's phones (2 phones)
INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Dequarius' AND last_name = 'Johnson' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Samsung' AND model = 'Galaxy S10'),
    (SELECT carrier_id FROM carriers WHERE name = 'Verizon')
);

INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (
    (SELECT invoice_id FROM invoices JOIN customers ON customers.customer_id = invoices.customer_id WHERE first_name = 'Dequarius' AND last_name = 'Johnson' ORDER BY invoice_id ASC LIMIT 1),
    (SELECT phone_id FROM phones WHERE make = 'Apple' AND model = 'iPhone 11'),
    (SELECT carrier_id FROM carriers WHERE name = 'Verizon')
);
