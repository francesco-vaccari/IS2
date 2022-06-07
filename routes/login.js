const express = require('express')
const { isNull } = require('url/util')
const User = require('../models/User')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('login', { req : req })
})


router.post('/', (req, res) => {
    req.session.token = req.body.token
    res.status(200).send()
})

router.delete('/', (req, res) => {
    req.session.token = ''
    res.status(200).send()
})

module.exports = router