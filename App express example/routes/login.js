const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    res.redirect('/')
})

module.exports = router