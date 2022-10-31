var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));


app.get('/test', function (request, response, next) { //  listen to get path; the function will get called if incoming info matches rules
    console.log("Got a test path");
    next();
});

app.all('*', function (request, response, next) { // * = listen to all paths; the function will get called if incoming info matches rules
    console.log(request.method + ' to path ' + request.path);
    next();
});

var products = require(__dirname + '/product_data.json');
products.forEach( (prod,i) => {prod.total_sold = 0}); // for each element of the array that it iterates through, it assigns the attribute the value of 0

app.get("/product_data.js", function (request, response, next) { // if /product_data.js is being requested, then send back products as a string
   response.type('.js');
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});

function isNonNegativeInteger(queryString, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(queryString) != queryString) {
        errors.push('Not a number!'); // Check if string is a number value
    } else {
        if (queryString < 0) errors.push('Negative value!'); // Check if it is non-negative
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

app.post("/process_form", function (request, response) { // process form by redirecting to the receipt page
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
            receipt += `<h3><font color="red">${q} is not a valid quantity for ${brand}!</font></h3>`;
        }
    }
    response.send(receipt);
    response.end();})

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback
