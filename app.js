const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
var crypto = require('crypto');


const app = express();
app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


var instance = new Razorpay({
  key_id: 'rzp_test_SYE6V1a7PERQqL',
  key_secret: 'abQcKHUEM089SMxfyvvS3ucL',
});



app.get("/",function(req,res){

  var options = {
    amount: 5000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
    payment_capture: '1',
    
  };
  instance.orders.create(options, function(err, order) {
    const order_id=order.id;
    res.render("template",{orderID:order_id});
  });
    
    
})

app.post("/success",function(req,res){
  var body = req.body.orderID+ "|" + req.body.payID;
  var generated_signature = crypto.createHmac('sha256','abQcKHUEM089SMxfyvvS3ucL')
                                                                .update(body.toString())                                    
                                                                .digest('hex'); 
console.log(generated_signature);
console.log( req.body.sign);
    if (generated_signature == req.body.sign) 
    {    
      console.log("Succesfull");
     }
     else{
       console.log("Broken");
       res.send(req.body);
     }
})




let port=process.env.PORT;

if(port==null || port==""){
  port=3000;
}

app.listen(port, () => console.log(`Server started on port ${port}`));


