const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/', (req, res) => {
    res.render('signup')
})

router.post('/', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    user.save()
    .then(data => {
        res.redirect('/profile/' + req.body.username)
    })
    
})

module.exports = router