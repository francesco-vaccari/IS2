const express = require('express')
const router = express.Router()
const { isNull } = require('url/util')
const Tourney = require('../../models/Tourney')

router.post('/', (req, res) => {
    Tourney.findOne({ "name": req.body.name }, (err, result) => {
        if(isNull(result)){
            const tourney = new Tourney({
                name: req.body.name,
                startingDate: req.body.startingDate,
                endingDate: req.body.endindDate,
                private: req.body.private
            })
            tourney.save()
            .then(data => {
                let id = tourney.id
                res.location('/api/v1/tourneys/' + id).status(201).send()
            })
        } else {
            res.status(409).json({ error: "Nome già in uso" })
            return
        }
    })    
})

router.get('/:id', (req, res) => {
    Tourney.findById(req.params.id, 'name startingDate endingDate private', (err, result) => {
        if(isNull(err)){
            res.status(200).json({ name: result.name, startingDate: result.startingDate, endindDate: result.endingDate, private: result.private })
        } else {
            res.status(404).json({ error: "Torneo non trovato"})
        }
    })
})

module.exports = router