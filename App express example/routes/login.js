const express = require('express')
const { isNull } = require('url/util')
const User = require('../models/User')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', (req, res) => {
    const user = User.findOne({ "username": req.body.username, "password": req.body.password }, 'username', (err, result) => {
        if(isNull(result)){
            console.log(err)
            res.redirect('/login')
        } else {
            res.redirect('/')
        }
    })
    
})

module.exports = router