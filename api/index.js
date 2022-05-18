// api/index.js
const apiBooks = require('./books');
module.exports = function(app) {
  apiBooks(app);
 // other routes
};