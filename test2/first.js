var express = require('express');
var util = require('util');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use('/static', express.static('public'));


// Handling GET requests
app.get('/hello', function(req, res){
    res.status(200).sendFile('/Users/franc/Desktop/IS2/test2/first.html');
});

// Handling POST requests
app.post('/subscribe', function(req, res){
    console.log(util.inspect(req.headers, {showHidden: false, depth: null}))
    console.log(util.inspect(req.params, {showHidden: false, depth: null}))
    res.status(201).send('You are now subscribed!');
});


app.listen(3000, function() {
    console.log('Server running on port ', 3000);
});
