// api/books.js
module.exports = function(app, database) {
    app.get('/books', (req, res) => {
        res.send('Response')
      });
    app.post('/books', (req, res) => {
      const book = {
        author: req.body.author,
        title: req.body.title,
        text: req.body.text
      };
    database.collection('books').insert(book, (err, result) => {
         if (err) {
            res.send(err);
          } else {
            res.send(result.ops[0]);
          }
     });
    })
  };