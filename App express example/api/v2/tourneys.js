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
        console.log("TUTTO OK")
        res.status(200).json({ message: "ok" })
    }
})

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