const express = require('express')
const router = express.Router()


router.get('/:name/:nameTeam', (req, res) => {
    res.render('tourneysTeam', { req: req, name: req.params.name, nameTeam: req.params.nameTeam })
})

router.get('/:name', (req, res) => {
    res.render('tourneys', { req: req, name: req.params.name })
})

module.exports = router