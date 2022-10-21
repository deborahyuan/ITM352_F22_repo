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

app.post("/process_form", function (request, response) {
    //response.send(request.body)
    var q = request.body['text1'];
    if (typeof q != 'undefined') {
        if(isNonNegativeInteger(q)) {
                response.send(`Thank you for purchasing <B>${q}</B> things!`);
        } else {
            response.send(`Plese enter a valid quantity -- hit the back button please`);
        }     
    };
 });

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback
