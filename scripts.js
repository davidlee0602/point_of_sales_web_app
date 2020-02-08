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

  add_phone_form_button.click(function(e) {

    console.log($(this).parents('form').children());
    console.log(createAddPhoneForm());
    e.preventDefault();
  });

  function createAddPhoneForm() {
    let row = $("<div></div>");

    row.addClass("row");

    return row;
  }

  //
  // '      <div class="row">
  //         <div class="col-lg-2">
  //           <label>
  //           Invoice Item 1
  //             <select name="phone_item_1">
  //               <option value=""> -- </option>
  //               <option value="1">iPhone 11 Pro Max</option>
  //               <option value="2">Samsung Galaxy Note 10+</option>
  //               <option value="3">OnePlus 7T Pro</option>
  //               <option value="4">Google Pixel 4 XL</option>
  //               <option value="5">Motorola Razr Black</option>
  //               <option value="6">Sony Xperia 1</option>
  //               <option value="7">Huawei P30 Pro</option>
  //             </select>
  //           </label>
  //         </div>
  //
  //         <div class="col-lg-2 col-lg-offset-2">
  //           <label>
  //           Carrier
  //             <select name="carrier_item_1">
  //               <option value=""> -- </option>
  //               <option value="1">AT&T</option>
  //               <option value="2">Cricket</option>
  //               <option value="3">Metro by T-Mobile</option>
  //               <option value="4">Mint</option>
  //               <option value="5">T-Mobile</option>
  //               <option value="6">Sprint</option>
  //               <option value="7">Verizon</option>
  //             </select>
  //           </label>
  //         </div>
  //       </div>';

});
