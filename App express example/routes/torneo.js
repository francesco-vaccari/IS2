const express = require('express')
const router = express.Router()

router.get('/:nameTourney', (req, res) => {
    res.render('torneo', { nameTourney: req.params.nameTourney })
})

module.exports = router