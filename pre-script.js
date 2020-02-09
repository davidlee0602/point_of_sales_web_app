$(function() {

  window.a51 = {};

  a51["phones"] = [
    {id: 1, name: "iPhone 11 Pro Max", price: "1199"},
    {id: 2, name: "Samsung Galaxy Note 10+", price: "1000"},
    {id: 3, name: "OnePlus 7T Pro", price: "999"},
    {id: 4, name: "Google Pixel 4 XL", price: "999"},
    {id: 5, name: "Motorola Razr Black", price: "1299"},
    {id: 6, name: "Sony Xperia 1", price: "890"},
    {id: 7, name: "Huawei P30 Pro", price: "1030"}
  ];

  a51["carriers"] = [
    {id: 1, name: "AT&T"},
    {id: 2, name: "Cricket"},
    {id: 3, name: "Metro by T-Mobile"},
    {id: 4, name: "Mint"},
    {id: 5, name: "T-Mobile"},
    {id: 6, name: "Sprint"},
    {id: 7, name: "Verizon"},
  ];

  // this custom object will be built on the back end
  a51["invoices"] = [
    {
      id: 1,
      customer_id: 1,
      customer_name: 'David Lee',
      date: '2020-02-07',
      invoice_paid: false,
      payment_method_id: 1,
      phones: [
        {phone_id: 1, carrier_id: 1, phone_name: "iPhone 11 Pro Max", carrier_name: "AT&T", price: "1199"},
        {phone_id: 4, carrier_id: 2, phone_name: "Google Pixel 4 XL",  carrier_name: "Cricket", price: "999"},
        {phone_id: 5, carrier_id: 3, phone_name: "Motorola Razr Black",  carrier_name: "Metro by T-Mobile", price: "1299"}
      ],
      total_due: 0.00
    }, //unpaid
    {
      id: 2,
      customer_id: 2,
      customer_name: 'Huy Nguyen',
      date: '2020-01-30',
      invoice_paid: true,
      payment_method_id: 2,
      phones: [
        {phone_id: 5, carrier_id: 6, phone_name: "Motorola Razr Black", carrier_name: "Sprint", price: "1299"},
        {phone_id: 7, carrier_id: 7, phone_name: "Huawei P30 Pro", carrier_name: "Verizon", price: "1030"}
      ],
      total_due: 0.00
    }, //paid
    {
      id: 3,
      customer_id: 3,
      customer_name: 'Mr. Chang',
      date: '2020-02-01',
      invoice_paid: false,
      payment_method_id: 1,
      phones: [
        {phone_id: 1, carrier_id: 1, phone_name: "iPhone 11 Pro Max", carrier_name: "AT&T", price: "1199"},
        {phone_id: 1, carrier_id: 2, phone_name: "iPhone 11 Pro Max", carrier_name: "Cricket", price: "1199"},
        {phone_id: 1, carrier_id: 3, phone_name: "iPhone 11 Pro Max", carrier_name: "Metro by T-Mobile", price: "1199"},
        {phone_id: 1, carrier_id: 4, phone_name: "iPhone 11 Pro Max", carrier_name: "Mint", price: "1199"},
        {phone_id: 1, carrier_id: 5, phone_name: "iPhone 11 Pro Max", carrier_name: "T-Mobile", price: "1199"}
      ],
      total_due: 0.00
    }  //unpaid
  ]


})
