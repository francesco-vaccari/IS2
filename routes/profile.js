const express = require('express')
const { isNull } = require('url/util')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('profile', { req : req })
})

module.exports = router