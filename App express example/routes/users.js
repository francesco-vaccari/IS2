const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
    res.send("User List")
});

router.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'new.html'))
})

router.post('/', (req, res) => {
    var name = req.body.firstName
    //req.query.name se passo i campi con metodo GET (?name=ciao)
    res.send('Created user ' + name)
    //res.redirect('/users/id) dopo aver creato l'utente perchè si fa così con una post
})

router.route('/:id').get((req, res) => {
    res.send('User get ' + req.params.id)
}).put((req, res) => {
    res.send('User put ' + req.params.id)
}).delete((req, res) => {
    res.send('User delete ' + req.params.id)
})

router.param('id', (req, res, next, id) => {
    console.log(id)
    next()
})

module.exports = router