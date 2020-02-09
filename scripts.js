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

  // create new invoice
  let add_phone_form_button = $('#add_phone_form_to_invoice');
  let phone_count = 1;

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
    blankOption.attr("selected", true);
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
    blankOption2.attr("selected", true);
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

  // when click to save invoice, get all form fields
  $("#save_invoice_button").click(function() {
    console.log("form stuff", $(this).parents().find("form").first().find(":input"));
  });

});
