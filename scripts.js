//document ready
$(function() {

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

});
