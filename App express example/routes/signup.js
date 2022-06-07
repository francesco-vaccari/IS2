const express = require('express')
const router = express.Router()
const { isNull } = require('url/util')
const User = require('../models/User')

router.get('/', (req, res) => {
    res.render('signup', { req : req })
})


module.exports = router