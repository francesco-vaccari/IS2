const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('creazioneTorneo')
})

router.post('/', (req, res) => {
    var nameTourney = req.body.nameTourney
    res.redirect('/torneo/' + nameTourney)
})

module.exports = router