-- Area 51 Phone Emporium
-- Data Manipulation Queries

-- NOTE: colon (':') character will be used to denote variables that will have data from the backend or from user input from the front end

-- CREATE QUERIES
-- CREATE phones http://web.engr.oregonstate.edu/~leed8/phones.html
INSERT INTO phones (make, model, image_url, purchase_cost, retail_cost) VALUES (:make_input, :model_input, :image_url_input, :purchase_cost_input, :retail_cost_input);
-- CREATE customers http://web.engr.oregonstate.edu/~leed8/customers.html
INSERT INTO customers (first_name, last_name, street, city, state, zip, phone, email) VALUES (:first_name_input, :last_name_input, :street_input, :city_input, :state_input, :zip_input, :phone_input, :email_input);
-- CREATE invoices http://web.engr.oregonstate.edu/~leed8/new_invoice.html
INSERT INTO invoices (invoice_date, invoice_paid, customer_id, payment_method_id) VALUES (:invoice_date_input, :invoice_paid_input, :customer_id_input, :payment_method_id_input);
  /*FOR EACH Phone & Carrier ADDITION*/
  /*this_invoice_id_value will store the invoice_id that was created*/
  INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (:this_invoice_id_value, :phone_id_dropdown_value, :carrier_id_dropdown_value);
  UPDATE invoices
    SET total_due = (SELECT IFNULL(SUM(phones.retail_cost), 0.00) FROM phones
                      JOIN invoice_details ON phones.phone_id = invoice_details.phone_id
                      WHERE invoice_details.invoice_id = (:this_invoice_id_value))
    WHERE invoices.invoice_id = (:this_invoice_id_value);
-- CREATE invoice_details http://web.engr.oregonstate.edu/~leed8/invoice_details.html
INSERT INTO invoice_details (invoice_id, phone_id, carrier_id) VALUES (:invoice_id_button_selected_value, :phone_id_dropdown_value, :carrier_id_dropdown_value);
-- CREATE payment_methods http://web.engr.oregonstate.edu/~leed8/paymentmethods.html
INSERT INTO payment_methods (name) VALUES (:payment_method_name_input);
-- CREATE carriers http://web.engr.oregonstate.edu/~leed8/carriers.html
INSERT INTO carriers (name) VALUES (:carrier_name_input);

-- READ/SELECT QUERIES (Table view)
-- READ/SELECT phones (/phones.html)
SELECT * FROM phones;
-- READ/SELECT customers (/customers.html)
SELECT * FROM customers;

-- READ/SELECT invoices (first view)
SELECT i.invoice_id, i.invoice_date, i.invoice_paid, i.total_due,
 c.customer_id, c.first_name, c.last_name, p.payment_method_id, p.name
FROM invoices i
JOIN customers c ON
c.customer_id = i.customer_id
LEFT JOIN payment_methods p ON
p.payment_method_id = i.payment_method_id
ORDER BY i.invoice_id ASC;

-- READ/SELECT invoices (filter view)
SELECT i.invoice_id, i.invoice_date, i.invoice_paid, i.total_due,
 c.customer_id, c.first_name, c.last_name, p.payment_method_id, p.name
FROM invoices i
JOIN customers c ON
c.customer_id = i.customer_id
LEFT JOIN payment_methods p ON
p.payment_method_id = i.payment_method_id
WHERE :attribute LIKE %:keyword% -- this would require some conditional branching for different types of attributes in the backend code
ORDER BY i.invoice_id ASC;

-- SPECIAL FILTER QUERY CONDITIONS --
-- (customer name):
--  WHERE c.first_name LIKE %:first_name%
--    OR c.last_name LIKE %:first_name%
--    OR c.first_name LIKE %:last_name%
--    OR c.last_name LIKE %:last_name%
-- (payment_method == UNPAID): WHERE p.payment_method_id IS NULL


-- READ/SELECT invoice_details (NOT USED)
/*SELECT i.invoice_id, i.invoice_date, i.invoice_paid, i.total_due,
 c.customer_id, c.first_name, c.last_name,
 p.payment_method_id, p.name,
 d.invoice_detail_id,
 ph.phone_id, ph.make, ph.model, ph.retail_cost,
 cr.carrier_id, cr.name
FROM invoices i
JOIN customers c ON
c.customer_id = i.customer_id
LEFT JOIN payment_methods p ON
p.payment_method_id = i.payment_method_id
JOIN invoice_details d ON
d.invoice_id = i.invoice_id
JOIN phones ph ON
ph.phone_id = d.phone_id
JOIN carriers cr ON
cr.carrier_id = d.carrier_id
ORDER BY i.invoice_id ASC;*/

-- Updated READ/SELECT Invoice Details
SELECT invoices.invoice_id, invoices.customer_id, customers.first_name, customers.last_name, 
invoices.invoice_date, invoices.invoice_paid, invoices.total_due FROM invoices 
INNER JOIN customers on invoices.customer_id = customers.customer_id WHERE invoices.invoice_paid = "0"';

-- READ/SELECT payment_methods
SELECT * FROM payment_methods;
-- READ/SELECT carriers
SELECT * FROM carriers;

-- UPDATE QUERIES
-- UPDATE phones (/phones.html)
UPDATE phones SET make = (:make_input), model = (:model_input), image_url = (:image_url_input), purchase_cost = (:purchase_cost_input), retail_cost = (:retail_cost_input)
WHERE phones.phone_id = (:phone_id_button_selected_value);
-- UPDATE customers
UPDATE customers SET first_name = (:first_name_input), last_name = (:last_name_input), street = (:street_input), city = (:city_input), state = (:state_input), zip = (:zip_input), phone = (:phone_input), email = (:email_input)
WHERE customers.customer_id = (:customer_id_button_selected_value);
-- UPDATE invoices
/* Update Button */
UPDATE invoices SET invoice_date = (:invoice_date_calender_selected_value), payment_method_id = (:payment_method_id_dropdown_value), customer_id = (:customer_id_dropdown_value)
WHERE invoices.invoice_id = (:invoice_id_selected_value);

/* Additional Requirement on Update Button: check if payment_method is null, if null, set invoice_paid to FALSE (0) */
UPDATE invoices SET invoice_paid = '0' /*Set invoice_paid status from 1 (TRUE) to 0 (False) when payment_method is set to null, */
WHERE invoices.invoice_id = (:invoice_id_selected_value);
/* Pay Button */
UPDATE invoices SET invoice_paid = '1' /*Set invoice_paid status from 0 (FALSE) to 1 (TRUE) - Must validate that payment_method is NOT NULL first */
WHERE invoices.invoice_id = (:invoice_id_selected_value);

-- UPDATE invoice_details
UPDATE invoice_details SET invoice_id = (:invoice_id_input), phone_id = (:phone_id_input), carrier_id = (:carrier_id_input)
WHERE invoice_details.invoice_detail_id = (:invoice_detail_id_selected_value);
-- UPDATE payment_methods
UPDATE payment_methods SET name = (:payment_method_name_input)
WHERE payment_methods.payment_method_id = (:payment_method_id_selected_value);
-- UPDATE carriers
UPDATE carriers SET name = (:carrier_name_input)
WHERE carriers.carrier_id = (:carrier_id_selected_value);

-- DELETE QUERY
-- DELETE invoice_details
DELETE FROM invoice_details WHERE invoice_detail_id = (:invoice_detail_id_selected_input);
UPDATE invoices
  SET total_due = (SELECT IFNULL(SUM(phones.retail_cost), 0.00) FROM phones
                    JOIN invoice_details ON phones.phone_id = invoice_details.phone_id
                    WHERE invoice_details.invoice_id = (:deleted_invoice_detail_selected_input_invoice_id)) /*variable value is the invoice_id of the already deleted invoice_detail row*/
  WHERE invoices.invoice_id = (:deleted_invoice_detail_selected_input_invoice_id); /*variable value is the invoice_id of the already deleted invoice_detail row*/
