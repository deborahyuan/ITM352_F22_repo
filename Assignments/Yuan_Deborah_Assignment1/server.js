const { getRandomValues } = require('crypto');
var express = require('express');
var app = express();
var path = require('path');


app.use(express.static(__dirname + '/public')); // route all other GET/POST requests to files in public 
app.use('/css',express.static(__dirname + '/public')); // ?
app.use(express.urlencoded({ extended: true }));

// functions
function isNonNegativeInteger(queryString, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(queryString) != queryString) {
        errors.push('Not a number!'); // Check if string is a number value
        } else {
        if (queryString < 0) errors.push('a Negative value!'); // Check if it is non-negative
        if (parseInt(queryString) != queryString) errors.push('Not an integer!'); // Check that it is an integer
        }

    if (returnErrors) {
        return errors;
    } else if (errors.length == 0) {
        return true;
    } else {
        return false;
    }
 }


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

 app.post("/purchase", function (request, response) { // process form by redirecting to the receipt page
// Process the form by redirecting to the receipt page if everything is valid.

let valid = true; // assume that all terms are valid
let ordered = "";
let allblank = false; // assume that it ISN'T all blank

let qtys = request.body[`quantity_textbox`];

for (let i in qtys) { // Iterate over all text boxes in the form.
    q = qtys[i];
    let model = products[i]['name'];
    if (q == 0) { // assigning no value to certain models to avoid errors in invoice.html
        ordered += model + "=" + q + "&";
    } else if (isNonNegativeInteger(q) && Number(q) <= products[i].quantity_available) { // if q is true, added to ordered string
            // We have a valid quantity. Add to the ordered string.
            products[i].quantity_available -= Number(q);
            ordered += model + "=" + q + "&"; // appears in invoice.html's URL
            /*response.redirect('invoice.html?' + ordered);*/
    } else if (Number(q) >= products[i].quantity_available) { // Existing stock is less than desired quantity
        valid = false;
       /* response.redirect('products_display.html?error=Invalid%20Quantity,%20Requested%20Quantity%20for%20'+model+'%20Exceeds%20Stock');*/
    } else if (isNonNegativeInteger(q) != true) { // quantity is "Not a Number, Negative Value, or not an Integer"
        valid = false;
       /* response.redirect('products_display.html?error=Invalid%20Quantity,%20Requested%20Quantity%20for%20'+model+'%20is%20'+isNonNegativeInteger(q,true));*/
    } else { // textbox has gone missing? or some other error
        valid = false;
        /* response.redirect('products_display.html?error=Invalid%20Quantity,%20Unknown%20Error%20has%20occured');*/
    }
}

if (qtys.join("") == 0) { // if the array qtys adds up to 0, that means there are no quantities being purchased
    allblank = true;
    console.log(allblank);
}

if (!valid || allblank) { // if any of the textboxes have invalid quantities OR if all boxes are blank, there is an error
    // If we found an error, redirect back to the order page.
    response.redirect('products_display.html?error=Invalid%20Quantity');
} else {
    // If everything is good, redirect to the receipt page.
    response.redirect('invoice.html?' + ordered);
}
});
   

// start server
app.listen(8080, () => console.log(`listening on port 8080`));