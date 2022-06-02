const express = require('express')
const router = express.Router()
const { isNull, isNullOrUndefined } = require('url/util')
const Team = require('../../models/Team')


router.get('/:name', (req, res) => {
    Team.findOne({ name: req.params.name }, (err, result) => {
        if(isNull(result)){
            res.status(404).json({ error: "team non trovato" })
            return
        } else {
           res.status(200).json({name: result.name})
        }
    })
})

module.exports = router