const express = require('express')
const router = express.Router()
const { isNull, isNullOrUndefined } = require('url/util')
const Game = require('../../models/Game')

router.get('/:date', (req, res) => {
    Game.findById(req.params.id, 'date', (err, result) => {
        if(isNull(err)){
            res.status(200).json({ date: result.date, teamUno: result.teamUno})
        } else {
            res.status(404).json({ error: "Partita non trovata"})
        }
    })
})

module.exports = router