var express = require('express');
var app = express();

var products = require(__dirname + '/products.json');
products.forEach( (prod,i) => {prod.total_sold = 0}); // for each element of the array that it iterates through, it assigns the attribute the value of 0

app.get("/products.json", function (request, response, next) { // if /product_data.js is being requested, then send back products as a string
   response.type('.js');
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
/* your code here 
products_array.forEach( (prod,i) => {prod.total_sold = 0}); // for each element of the array that it iterates through, it assigns the attribute the value of 0
*/

// route all other GET requests to files in public 
app.use(express.static(__dirname + '/public'));

// start server
app.listen(8080, () => console.log(`listening on port 8080`));