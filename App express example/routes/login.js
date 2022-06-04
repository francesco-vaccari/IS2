const express = require('express')
const { isNull } = require('url/util')
const User = require('../models/User')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', (req, res) =>{
    //Controlli se username e password con query
    //setta cookie e session
    //redirect alla home
})

module.exports = router