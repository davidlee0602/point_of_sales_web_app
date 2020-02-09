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

  // event listener to button add new phone forms to invoices (both new and edit)
  add_phone_form_button.click(function(e) {
    let new_row = createAddPhoneForm();

    $(this).parents('form').find(".phone_form").last().after(new_row);

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
    let phoneSelectName = "phone_item_" + phone_count;
    let phoneSelect = $("<select/>");
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
    let carrierSelectName = "carrier_item_" + phone_count;
    let carrierSelect = $("<select/>");
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

      carrierOption.text(window.a51.carriers[i].name);
      carrierSelect.append(carrierOption);
    }
    // put select inside label, then inside phone column
    carrierLabel.append(carrierSelect);
    carrierDiv.append(carrierLabel);

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

  // when click to save invoice, get all form fields
  $("#save_invoice_button").click(function() {
    console.log("form stuff", $(this).parents().find("form").first().find(":input"));
  });


  // search/filter functionality
  $('.table-search').first().on("keyup", function() {
    //grab input value
    let value = $(this).val().toLowerCase();

    // filter table rows by input value
    $('input.table-search').parent().next()
    .find('.table-searchable tr')
    .filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    })
  });

});
