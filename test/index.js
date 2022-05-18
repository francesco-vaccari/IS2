// index.js
const express = require('express');
const mongoose = require('mongoose')
const app = express();
// parse application/json
app.use(require('body-parser').json());
// register endpoints
database = 'ciao'
require('./api/index')(app, database);
mongoose.connect('mongodb://localhost:27017/test', (err, database) => {
  if (err) return console.log(err) 
  app.listen(3333, () => {
    console.log('server started!');
  });
})