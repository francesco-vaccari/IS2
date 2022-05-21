const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/:username', (req, res) => {
    res.render('profile', { username: req.params.username })
})

module.exports = router