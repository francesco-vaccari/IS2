const express = require('express')
const router = express.Router()
const { isNull } = require('url/util')
const Tourney = require('../../models/Tourney')
const Team = require('../../models/Team')

router.post('/', (req, res) => {
    if(!validate(req)){
        console.log("ERRORE")
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        //creare risorsa e inserirla nel db
        const tourney = new Tourney({
            name: result.name, 
            startingDate: result.startingDate, 
            endingDate: result.endingDate,
            private: Boolean,
            format: String,
            teams: []
        })
        tourney.save()
        .then(data => {
            let id = tourney.id
            res.location('/api/v2/tourneys/' + id).status(201).send()
        })
        console.log("TUTTO OK")
        res.status(200).json({ message: "ok" })
    }
})

router.get('/:name', (req, res) => {
    Tourney.findById(req.params.id, 'name startingDate endingDate', (err, result) => {
        if(isNull(err)){
            res.status(200).json({ name: result.name, startingDate: result.startingDate, endingDate: result.endingDate})
        } else {
            res.status(404).json({ error: "Torneo non trovato"})
        }
    })
})

//da modificare
/*
router.delete('/', (req, res) => {
    Tourney.findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
        if(isNull(result)){
            res.status(404).json({error: "Utente non eliminato"})
        } else {            
            User.deleteOne({ username: req.body.username, password: req.body.password }, (err, result) => {            
                if(isNull(err)){
                    res.status(204)
                } else {
                    res.status(500).json({ message: "Server Error"})
                }
            })
        }
    })
})
*/

function validate(req){
    console.log(req.body)
    if(!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('startingDate') || !req.body.hasOwnProperty('endingDate') || !req.body.hasOwnProperty('private') || !req.body.hasOwnProperty('format') || !req.body.hasOwnProperty('teams')){console.log("qui");return false}
    console.log("body ok")
    if(req.body.name == ""){return false}
    console.log("name ok")
    if(req.body.format == ""){return false}
    console.log("format ok")
    let startingDate = new Date(req.body.startingDate)
    let endingDate = new Date(req.body.endingDate)
    if(startingDate.toString() == "Invalid Date" || endingDate.toString() == "Invalid Date"){return false}
    if(Date.now() > endingDate.getTime() || startingDate.getTime() > endingDate.getTime()){return false}
    console.log("dates ok")
    if(req.body.private != "true" && req.body.private != "false"){return false}
    console.log("private ok")
    if(!Array.isArray(req.body.teams) || req.body.teams.length == 0){return false}
    console.log("teams ok")

    return true
    
}

module.exports = router