const express = require('express')
const { isNull } = require('url/util')
const User = require('../models/User')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login', { message: req.query.message, username: req.query.username})
})

router.post('/', (req, res) => {
    const user = User.findOne({ "username": req.body.username, "password": req.body.password }, 'username', (err, result) => {
        if(isNull(result)){
            res.redirect('/login?username=' + req.body.username + '&message=ERRORE: username o password errati o non registrati')
        } else {
            res.redirect('/')
        }
    })
})

module.exports = router