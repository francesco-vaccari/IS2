const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"))
})

router.post('/', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    res.redirect('/profile/' + username)
})

module.exports = router