const express = require('express')
const router = express.Router()
const { isNull, isNullOrUndefined } = require('url/util')
const Game = require('../../models/Game')

router.get('/:id', (req, res) => {
    Game.findOne({"id": req.params.id}, (err, result) => {
        if(isNull(result)){
            res.status(404).json({ error: "Partita non trovata"})
        } else {
            res.status(200).json({ date: result.date, teamUno: result.teamUno, teamDue: result.teamDue})
        }
    })
})

module.exports = router
