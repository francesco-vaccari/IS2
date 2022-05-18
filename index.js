// index.js
const express = require('express');
// chiama mongoose
const mongoose = require('mongoose');
const app = express();
// parse application/json
app.use(require('body-parser').json());
// prova
//database = 'mongodb://localhost:27017/test'
database = 'ciao'
// register endpoint
require('./api/index')(app, database);
// connetti database
mongoose.connect('mongodb://localhost:27017/test', (err, database) => {
    if (err) return console.log(err)
    app.listen(8080, () => {
        console.log('server started!');
    });
})