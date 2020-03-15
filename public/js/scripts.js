//document ready
$(function() {

  //add form animations
  let addFormButton = $('.add-form-btn');
  let addFormCancel = $('.add-form-cancel');

  //add form button
  addFormButton.click(function() {
    //hide add button
    $(this).addClass('hide');
    //show cancel button
    $(this).next().removeClass('hide');
    //show add new form
    $(this).next().next().css({width: '100%', height: '500px'});
  })

  //cancel add form button
  addFormCancel.click(function(){
    //hide cancel button
    $(this).addClass('hide');
    //show add button
    $(this).prev().removeClass('hide');
    //collapse add new form
    $(this).next().css({width: 0, height: 0});
  })


  // invoices
  // NOTE: the first .phone_form in invoices is the reference point, make sure there is always at least 1

  // create new invoice
  let add_phone_form_button = $('.add_phone_form_to_invoice');
  let invoice_page_regex = /edit_invoice/g;
  let phone_count = 1;

  // search url path to see if this is edit_invoice page
  let is_edit_invoice = window.location.pathname.match(invoice_page_regex);

  //  edit invoice

  if (is_edit_invoice) {
    // invoice_id_select
    let invoice_id_select = $('#edit_invoice_number');

    // populate invoice id selection
    if (typeof window.a51.invoices != "undefined") {
      for (let i = 0; i < window.a51.invoices.length; i++) {
        if (!window.a51.invoices[i].invoice_paid) {
          let id_option = $('<option/>', {
            'value': window.a51.invoices[i].id
          })

          id_option.text(window.a51.invoices[i].id + " -- " + window.a51.invoices[i].customer_name);
          invoice_id_select.append(id_option);
        }
      }
    }

    // add event listener to invoice id selection
    invoice_id_select.change(function() {
      let chosen_invoice_id = $(this).val();
      let selected_invoice;

      // get matching invoice data for selected invoice id
      if (typeof window.a51.invoices != "undefined") {
        for (let i = 0; i < window.a51.invoices.length; i++) {
          if (window.a51.invoices[i].id == chosen_invoice_id) {
            selected_invoice = window.a51.invoices[i];
            break;
          }
        }
      }

      // populate invoice with invoice data
      if (selected_invoice) {
        resetAddPhoneForms();
        updateEditInvoiceForm(selected_invoice);
      } else {
        console.log("blank"); // reset invoice fields ?? or nah
      }
    });
  }

  // event listener to button add new phone forms to new invoices form
  add_phone_form_button.click(function(e) {
    let new_row = createAddPhoneForm();

    $(this).parents('form').find(".phone_form").last().after(new_row);

    // attach form change handlers to new row to
    // update invoice_due total
    //  and to show/hide checkmark that validates if both phone and carrier are selected
    attach_phone_form_handlers(new_row);

    e.preventDefault();
  });

  function createAddPhoneForm() {
    phone_count++;

    //new phone form row
    let row = $("<div/>");
    row.addClass("row");
    row.addClass("phone_form");

    //phone select
     // div
    let phoneDivText = "Invoice Item " + phone_count;
    let phoneDiv = $("<div/>");
    phoneDiv.addClass("col-lg-2");
     // label
    let phoneLabel = $("<label/>");
    phoneLabel.text(phoneDivText);
     // select
    let phoneSelectClass = "invoice_phones";
    let phoneSelectName = "phone_item_" + phone_count;
    let phoneSelect = $("<select/>");
    phoneSelect.addClass(phoneSelectClass);
    phoneSelect.attr("name", phoneSelectName);
     // select blank option
    let blankOption = $("<option/>");
    blankOption.text("--");
    blankOption.attr("value", "");
    blankOption.prop("selected", true);
    phoneSelect.append(blankOption);
    //add all phones to select options
    for (let i = 0; i<window.a51.phones.length; i++) {
      let phoneOption = $("<option/>", {
        "value": window.a51.phones[i].id,
        "data-price": window.a51.phones[i].price
      })

      phoneOption.text(window.a51.phones[i].name);
      phoneSelect.append(phoneOption);
    }
    // put select inside label, then inside phone column
    phoneLabel.append(phoneSelect);
    phoneDiv.append(phoneLabel);


    //carrier select
      // div
    let carrierDivText = "Carrier";
    let carrierDiv = $("<div/>");
    carrierDiv.addClass("col-lg-2");
    carrierDiv.addClass("col-lg-offset-2");
      // label
    let carrierLabel = $("<label/>");
    carrierLabel.text(carrierDivText);
    // select
    let carrierSelectClass = "invoice_carriers";
    let carrierSelectName = "carrier_item_" + phone_count;
    let carrierSelect = $("<select/>");
    carrierSelect.addClass(carrierSelectClass);
    carrierSelect.attr("name", carrierSelectName);
      // select blank option
    let blankOption2 = $("<option/>");
    blankOption2.text("--");
    blankOption2.attr("value", "");
    blankOption2.prop("selected", true);
    carrierSelect.append(blankOption2);
    //add all carriers to select options
    for (let i = 0; i<window.a51.carriers.length; i++) {
      let carrierOption = $("<option/>", {
        "value": window.a51.carriers[i].id
      })
      carrierOption.text(window.a51.carriers[i].name.replace(/&amp;/g, '&'));
      carrierSelect.append(carrierOption);
    }
    // put a break after carrier label, a select inside label, then inside phone column
    carrierLabel.append($("<br/>"));
    carrierLabel.append(carrierSelect);
    carrierDiv.append(carrierLabel);

    // create span to hold checkmark to denote if
    // phone form is valid (has selected both phone and carrier)
    // append as last child of carrierDiv
    // <span class="phone_row_valid green glyphicon glyphicon-ok hide"></span>
    let validCheckmarkSpan = $("<span/>");
    let validCheckmarkSpanClasses =
      ["phone_row_valid", "green", "glyphicon", "glyphicon-ok", "hide"];
    validCheckmarkSpan.addClass(validCheckmarkSpanClasses.join(" "));
    carrierDiv.append(validCheckmarkSpan);

    row.append(phoneDiv);
    row.append(carrierDiv);
    return row;
  }

  function resetAddPhoneForms() {
    // reset global phone_count for subsequent phone form additions
    phone_count = 1;

    // remove all phone forms except the first one (the first phone form is the reference point)
    $('.phone_form:not(:first)').remove();

    // reset first phone form
    $('.phone_form:first').find('select[name="phone_item_1"]').find('option[value=""]').prop("selected", true);
    $('.phone_form:first').find('select[name="carrier_item_1"]').find('option[value=""]').prop("selected", true);
  }

  function updateEditInvoiceForm(selected_invoice) {
    let edit_invoice_form = $('#edit_invoice_form');
    let status = $('select[name="status"]');
    let date = $('input[name="date"]');
    let customer = $('select[name="customer_id"]')
    let payment = $('select[name="payment_method_id"]');
    let first_phone = $('select[name="phone_item_1"]');
    let first_carrier = $('select[name="carrier_item_1"]');

    // STATUS
    status.find('option[value="' + selected_invoice.invoice_paid + '"]').prop("selected", true);

    // DATE
    date.val(selected_invoice.date);

    // customer name
    customer.find('option[value="' + selected_invoice.customer_id + '"]').prop("selected", true);

    // payment method
    payment.find('option[value="' + selected_invoice.payment_method_id + '"]').prop("selected", true);

    // phones
    if (selected_invoice.phones.length) {
      // populate first phone and carrier
      first_phone.find('option[value="' + selected_invoice.phones[0].phone_id + '"]').prop("selected", true);
      first_carrier.find('option[value="' + selected_invoice.phones[0].carrier_id + '"]').prop("selected", true);

      // cache phone form rows to add subsequent phone forms
      let phone_forms = first_phone.parents('div.phone_form').last();

      // populate all other phones
      for (let i = 1; i < selected_invoice.phones.length; i++) {
        let new_phone_row = createAddPhoneForm();

        // populate selected phone detail
        new_phone_row.find('select[name="' + "phone_item_"+(i+1) + '"]')
        .find('option[value="' + selected_invoice.phones[i].phone_id + '"]').prop("selected", true);

        // populate selected carrier detail
        new_phone_row.find('select[name="' + "carrier_item_"+(i+1) + '"]')
        .find('option[value="' + selected_invoice.phones[i].carrier_id + '"]').prop("selected", true);

        // insert phone into invoice
        phone_forms.after(new_phone_row);

        // move phone_form pointer down after this new input
        phone_forms = phone_forms.next();
      }
    }
  }

  function processCreateNewInvoiceForm(is_pay) {
    let date = $("[name='date']").val();
    let customer_id = $("[name='customer_id']").val();
    let payment_method_id = $("[name='payment_method_id']").val() ? $("[name='payment_method_id']").val() : false;

    // check if payment method is chosen before paying
    if (is_pay && !payment_method_id) {
      window.alert("You need to choose a payment method before you can pay!");
      return;
    }

    //phones and carriers
    let invoice_items = {};
    let invoice_phones = $(".invoice_phones");
    let invoice_carriers = $(".invoice_carriers");

    invoice_phones.each(function(index) {
      invoice_items[index+1] = {};
      invoice_items[index+1].phone_id = this.value;
    });

    invoice_carriers.each(function(index) {
      invoice_items[index+1].carrier_id = this.value;
    })

    // clean up invoice_items of null phones or null carriers
    let id_to_delete = [];
    for (const id in invoice_items) {
      if (!invoice_items[id].phone_id || !invoice_items[id].carrier_id) {
        id_to_delete.push(id);
      }
    }
    for (let i = 0, k = id_to_delete.length; i<k; i++) {
      let to_delete = id_to_delete[i];
      delete invoice_items[to_delete];
    }

    // if trying to pay but no valid phone items are selected, stop the payment
    if (is_pay && !Object.entries(invoice_items).length) {
      window.alert("You can't pay for an invoice with no phones!");
      return;
    }

    // send data to server
    if (date && customer_id) {
      $.ajax({
        type: "POST",
        url: "/new_invoice",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          date: date,
          pay: is_pay,
          payment: payment_method_id,
          customer_id: customer_id,
          invoice_items: invoice_items
        }),
      })
      .done((data, status) => {
        // success
        window.alert("Success!");
        window.location = "/invoices";
      })
      .fail((response, status) => {
        // big error
        window.alert("Oops.. something went wrong.");
        console.log("oops", response.statusText, status);
      })

    } else {
      window.alert("Missing date or customer!");
    }
  }

  // when click to save invoice, get all form fields
  $("#save_invoice_button").click(function(e) {
    // console.log("form stuff", $(this).parents().find("form").first().find(":input"));
    let is_pay = false;
    processCreateNewInvoiceForm(is_pay);

    e.preventDefault();
  });

  // when click to pay invoice from /new_invoice
  $("#pay_invoice_button").click(function(e) {
    let is_pay = true;
    processCreateNewInvoiceForm(is_pay);

    e.preventDefault();
  });


  // search/filter functionality
  // citation: https://www.w3schools.com/bootstrap/bootstrap_filters.asp
  // $('.table-search').first().on("keyup", function() {
  //   //grab input value
  //   let value = $(this).val().toLowerCase();
  //
  //   // filter table rows by input value
  //   $('input.table-search').parent().next()
  //   .find('.table-searchable tr')
  //   .filter(function() {
  //     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  //   })
  // });

/*DAVID 03082020*/
//reference table for use in invoice_details page
let counter_test = {count:0};
function counter(){
    ++counter_test.count;
}
function counter_start(varobj){
  counter_test.count = varobj;
}

let reference_price = {};
let reference_phone = {};
let reference_carrier = {};
let reference_customer = {};

//add invoice detail
$("#add_invoice_detail").click(function () {
    let invoice_id = document.getElementById("fixed_invoice_id").value
    let phone_id = document.getElementById("phone_option").value
    let carrier_id = document.getElementById("carrier_option").value
    if(phone_id != "none" && carrier_id != "none"){


    counter();
    $("#invoice_detail_table").after('<tr value =' + invoice_id + '><td value = ' + counter_test.count + '>' + counter_test.count + '</td><td value = ' + counter_test.count + '>'+reference_phone[phone_id]+'</td><td value = ' + counter_test.count + '>'+reference_carrier[carrier_id]+'</td><td value = ' + counter_test.count + '>'+reference_price[phone_id]+'</td><td value = ' + counter_test.count + '><div class="row text-center"><button title="remove_phone" class="btn btn-danger btn-sm" type="button" value='+ counter_test.count +'>DELETE</button></div></td></tr>');

    $.ajax({
        type: "POST",
        url: "/new_invoice_details",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          invoice: invoice_id,
          phone: phone_id,
          carrier: carrier_id
        }),
      })

     }else{
      alert("Please select a phone and carrier to add.")
     }
 });

//filter invoice details modal
$(document).ready(function($) { //need to change to specific
    $("#invoice_detail_table").find("td").each(function (i, row)
            {
                  counter_start($(this).attr('value'));
                })
  });

$("[title|='details_table']").click(function () {
    document.getElementById("fixed_invoice_id").value = $(this).val();
    $("#invoice_detail_table").find("td").each(function (i, row)
            {
                  counter_start($(this).attr('value'));
                })
    var rows = $("#invoice_detail_table").find("tr").hide();
    rows.filter("tr[value='"+$(this).val()+"']").show();
 });

$("[title|='close_details_table']").click(function () {
    location.reload(true);
    localStorage.setItem("ref_id",-1);
 });

//remove phone and carrier from invoice details
$(document).on('click',"[title|='remove_phone']", function() {
        $.ajax({
        type: "POST",
        url: "/delete_invoice_details",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          delete_id: $(this).val()
          }),
        })
  $(this).closest('tr').remove();
});

//load reference tables
$(document).ready(function(){

     $.ajax({ type: "GET",
         url: "/phones/lookup",
         async: true,
         success : function(response)
         {
          for (i = 0; i < response.results.length; i++){
            reference_price[response.results[i]["phone_id"]] =  response.results[i]["price"];
            reference_phone[response.results[i]["phone_id"]] =  response.results[i]["make"] +" "+ response.results[i]["model"];
          }
         }
    });

     $.ajax({ type: "GET",
     url: "/phones2/lookup",
     async: true,
     success : function(response)
     {
        for (i = 0; i < response.results.length; i++){
        reference_phone[response.results[i]["phone_id"]] =  response.results[i]["make"] +" "+ response.results[i]["model"];
      }
     }
    });

     $.ajax({ type: "GET",
         url: "/carriers/lookup",
         async: true,
         success : function(response)
         {
          for (i = 0; i < response.results.length; i++){
            reference_carrier[response.results[i]["carrier_id"]] =  response.results[i]["name"];
          }
         }
    });

     $.ajax({ type: "GET",
         url: "/customers/lookup",
         async: true,
         success : function(response)
         {
          for (i = 0; i < response.results.length; i++){
            reference_customer[response.results[i]["customer_id"]] =  [response.results[i]["first_name"], response.results[i]["last_name"], response.results[i]["street"], response.results[i]["city"], response.results[i]["state"], response.results[i]["zip"], response.results[i]["phone"], response.results[i]["email"]];
          }
         }
    });


});
/*DAVID 03082020*/
$(document).on('click',"[title|='update_carrier']", function() {
	document.getElementById("carrier_id_holder").value = $(this).val();
  // pre-populate modal form with value of selected carrier
  document.getElementById("carrier_name").value = $(this).parent().parent().siblings().first().text();
});

$(document).on('click',"[title|='update_payment_method']", function() {
  document.getElementById("payment_method_id_holder").value = $(this).val();
  // pre-populate modal form with value of selected payment method
  document.getElementById("payment_name").value = $(this).parent().parent().siblings().first().text();
});

$(document).on('click',"[title|='update_customer']", function() {
  document.getElementById("customer_id_holder").value = $(this).val();
  document.getElementById("first_name").value = reference_customer[$(this).val()][0];
  document.getElementById("last_name").value = reference_customer[$(this).val()][1];
  document.getElementById("street").value = reference_customer[$(this).val()][2];
  document.getElementById("city").value = reference_customer[$(this).val()][3];
  document.getElementById("state").value = reference_customer[$(this).val()][4];
  document.getElementById("zip").value = reference_customer[$(this).val()][5];
  document.getElementById("phone").value = reference_customer[$(this).val()][6];
  document.getElementById("email").value = reference_customer[$(this).val()][7];
});
/*DAVID 03082020_2*/


  // UPDATE PHONES
  // Populate phones update modal form
  $(".update-phone-button").click(function(e) {
    // modal inputs
    let phone_id_input = $('input[name=phone_id]');
    let make_input = $('input[name=make_update]');
    let model_input = $('input[name=model_update]');
    let image_url_input = $('input[name=image_url_update]');
    let purchase_cost_input = $('input[name=purchase_cost_update]');
    let retail_cost_input = $('input[name=retail_cost_update]');

    // row values
    let row = $(this).parent().parent();
    let make_value = row.siblings(".phone_make").first().text();
    let model_value = row.siblings(".phone_model").first().text();
    let image_value = row.siblings(".phone_img_url").first().data("url");
    let purchase_value = row.siblings(".phone_purchase_cost").first().text();
    let retail_value = row.siblings(".phone_retail_cost").first().text();

    // populate form fields
    phone_id_input.val($(this).data("phone-id"));
    make_input.val(make_value);
    model_input.val(model_value);
    image_url_input.val(image_value);
    purchase_cost_input.val(purchase_value);
    retail_cost_input.val(retail_value);
  });


  // UPDATE INVOICES
  // Populate invoice update modal form
  $(".update-invoice-button").click(function(e) {
    // modal inputs
    let invoice_id_input = $('input[name=invoice_id_holder]');
    let invoice_date_input = $('input[name=date_input]');
    let customer_input = $('select[name=customer_input]');
    let payment_method_input = $('select[name=payment_method_input]');

    // row values
    let row = $(this).parent().parent();
    let invoice_id_value = row.siblings(".invoice_id").first().text();
    let date_value = row.siblings(".invoice_date").data("date-value");
    let customer_id_value = row.siblings(".invoice_customer_id").first().text();
    let payment_method_value = row.siblings(".invoice_payment_method").data("payment-method-id");

    // populate form fields
    invoice_id_input.val(invoice_id_value);
    invoice_date_input.val(date_value);
    customer_input.val(customer_id_value);
    payment_method_input.val(payment_method_value);
  })

  // PAY INVOICE FROM INVOICES PAGE
  $(".pay-invoice-button").click(function(e) {
    let invoice_id = $(this).data("value");
    let payment_method_value = $(this).parent().parent().siblings(".invoice_payment_method").data("payment-method-id");

    // front-end validation: to prevent user from paying an invoice that has no phones,
    // check if total_due column on table is zero.
    // not the best solution, a better solution would be to validate on the back end,
    // or have a way of checking the number of phones on an invoice from the front end
    let invoice_total = $(this).parent().parent().siblings(".invoice_total_due").text();
    if (invoice_total == 0) {
      window.alert("You can't pay for an invoice with no phones!");
      return;
    }

    if (payment_method_value) {
      let answer = confirm("Are you sure you want to pay this invoice?");
      if (answer) {
        $.ajax({
          type: "POST",
          url: "/pay_invoice",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({
            invoice_id: invoice_id
          }),
        })
        .done((data, status) => {
          // success
          window.alert("Success!");
          window.location = "/invoices";
        })
        .fail((response, status) => {
          // big error
          window.alert("Oops.. something went wrong.");
          console.log("oops", response.statusText, status);
        })
      }
    } else {
      window.alert("You can't pay without choosing a payment method!");
    }
  })


  // UPDATE TOTAL FUNCTIONALITY ON NEW INVOICE PAGE

  // handler functions
  function update_invoice_total_due() {
    let total_field = $("span.total_due")
    let total = 0;

    let phone_form_rows = $(".phone_form");

    phone_form_rows.each(function(row) {
      // only add phone's price to invoice total if both phone and carrier are selected
      let phone_select = $(this).find("select.invoice_phones");
      let carrier_select = $(this).find("select.invoice_carriers");
      let phone_val = phone_select.val();
      let carrier_val = carrier_select.val();

      // add selected phone price to total if carrier has been selected
      if (phone_val && carrier_val) {
        let phone_price = phone_select.find("[value=" + phone_val + "]").data("price");
        if (phone_price) {
          total += phone_price;
        }
      }
    })

    // fix total to have only 2 decimal digits
    total = parseFloat(total).toFixed(2);
    // update total due field on invoice form
    total_field.text(total);
  }

  function show_hide_phone_form_validation(new_div) {
    let phone_select = new_div.find("select.invoice_phones");
    let carrier_select = new_div.find("select.invoice_carriers");
    let check_mark_span = new_div.find("span.phone_row_valid");
    let phone_val = phone_select.val();
    let carrier_val = carrier_select.val();

    // toggle check mark depending on if both phones and carriers were selected
    if (phone_val && carrier_val) {
      check_mark_span.removeClass("hide");
    } else {
      check_mark_span.addClass("hide");
    }
  }

  // abstraction to allow attaching handlers to dynamic rows as well as static rows (first row on page)
  function phone_form_handlers(new_div) {
    update_invoice_total_due();

    // pass the phone form to the show/hide handler
    show_hide_phone_form_validation(new_div);
  }

  // need to attach invoice_due update functions to
  // dynamically created phone form rows when they are created,
  // this is the wrapper function for dynamic rows that calls attach_phone_form_handlers
  function attach_phone_form_handlers(new_div) {
    let phone_select = new_div.find("select.invoice_phones");
    let carrier_select = new_div.find("select.invoice_carriers");

    phone_select.change(function(e) {
      phone_form_handlers(new_div);
    })

    carrier_select.change(function(e) {
      phone_form_handlers(new_div);
    })
  }

  // attach invoice_due update to first phone and carrier form row on invoices page
  //  and attach show/hide checkmark to denote if phone form row has selected both a phone and carrier

  // attach to first static phone select
  $("select.invoice_phones").change(function(e) {
    // get the ancestor .phone_form (containing row div) as pass it to the show/hide handler
    let this_row = $(this).closest(".phone_form");
    phone_form_handlers(this_row);
  })

  // attach to first static carrier select
  $("select.invoice_carriers").change(function(e) {
    // get the ancestor .phone_form (containing row div) as pass it to the show/hide handler
    let this_row = $(this).closest(".phone_form");
    phone_form_handlers(this_row);
  })

//david 03142020


$(document).on('click',"[title|='navigate_invoice_details']", function() {
  localStorage.setItem('ref_id', $(this).val());
  $(location).attr("href", "/invoice_details");
});

$(document).ready(function($) { //need to change to specific
    $("[title|='phone_table_image_search']").find("td").each(function (i, row)
            {
              if ($(this).attr('data-url') != undefined) {
                if($(this).attr('data-url').toLowerCase().search(".com") > 0){
                  console.log($(this).attr('data-url'));
                }
              }
            })
  });
});
