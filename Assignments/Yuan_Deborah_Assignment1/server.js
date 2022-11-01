var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

var products = require(__dirname + '/products.json');
products.forEach( (prod,i) => {prod.total_sold = 0}); // for each element of the array that it iterates through, it assigns the attribute the value of 0



app.get("/products.json", function (request, response, next) { // if /products.json is being requested, then send back products as a string
   response.type('.json');
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});


// Routing 

// monitor all requests
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

// process purchase request (validate quantities, check quantity available)
function isNonNegativeInteger(queryString, returnErrors = false) {
   errors = []; // assume no errors at first
   if(Number(queryString) != queryString) errors.push('Not a number!'); // Check if string is a number value
   if(queryString < 0) errors.push('Negative value!'); // Check if it is non-negative
   if(parseInt(queryString) != queryString) errors.push('Not an integer!'); // Check that it is an integer

   if (returnErrors) {
       return errors;
   } else if (errors.length == 0) {
       return true;
   } else {
       return false;
   }
}

function checkQuantityTextbox(theTextbox) {
   errs = isNonNegativeInteger(theTextbox.value, true);
   document.getElementById(theTextbox.name + '_message').innerHTML = errs.join(", ");
}

app.post("/purchase", function (request, response) { // process form by redirecting to the receipt page
   function isNonNegativeInteger(queryString, returnErrors = false) {
      errors = []; // assume no errors at first
      if(Number(queryString) != queryString) errors.push('Not a number!'); // Check if string is a number value
      if(queryString < 0) errors.push('Negative value!'); // Check if it is non-negative
      if(parseInt(queryString) != queryString) errors.push('Not an integer!'); // Check that it is an integer
   
      if (returnErrors) {
          return errors;
      } else if (errors.length == 0) {
          return true;
      } else {
          return false;
      }
   }
   
   receipt = '';
   let qtys = request.body[`quantity_textbox`];
   for (i in qtys) {
       q = qtys[i];
       let brand = products[i]['name'];
       let brand_price = products[i]['price'];
       if (isNonNegativeInteger(q)) {
           products[i]['total_sold'] += Number(q);
           receipt += `<h3>Thank you for purchasing: ${q} ${brand}. Your total is $${q * brand_price}!</h3>`; // render template string
       } else {
           receipt += `<h3><font color="red">${q} is not a valid quantity for ${brand}!, ${isNonNegativeInteger(q)}</font></h3>`; // NEEDS ATTENTION!
       }
   }
   response.send(receipt);
   response.end();})

   

/* your code here 
products_array.forEach( (prod,i) => {prod.total_sold = 0}); // for each element of the array that it iterates through, it assigns the attribute the value of 0
*/

// route all other GET requests to files in public 
app.use(express.static(__dirname + '/public'));

// start server
app.listen(8080, () => console.log(`listening on port 8080`));