const express = require('express')
const router = express.Router()
const { isNull } = require('url/util')
const { isNullOrUndefined } = require('url/util')
const Tourney = require('../../models/Tourney')
const Team = require('../../models/Team')
const Player = require('../../models/Player')
const User = require('../../models/User')


//aggiungere che crea le partite in modo automatico e aggiunge al documento
router.post('/', (req, res) => {
    if (!validatePost(req)) {
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        Tourney.findOne({ name: req.body.name }, (err, result) => {
            if(isNull(result)){
                User.findOne({ username: req.body.username }, (err, result) => {
                    if(isNull(result)){
                        res.status(404).json({ error: "username passato non trovato" })
                        return
                    } else {
                        let startingDate = new Date(req.body.startingDate).getTime()
                        let endingDate = new Date(req.body.endingDate).getTime()
                        const torneo = new Tourney ({
                            name: req.body.name,
                            owner: result.id,
                            startingDate: startingDate,
                            endingDate: endingDate,
                            format: req.body.format,
                            private: req.body.private,
                            games: [],
                            teams: []
                        })
                        torneo.save()
                        .then(data => {
                            for(counter in req.body.teams){
                                let item = req.body.teams[counter]
                                let team = new Team({
                                    name: item,
                                    players: []
                                })
                                team.save()
                                .then(data => {
                                    Tourney.updateOne({ _id: torneo._id }, { $push: { teams: team._id } }, (err, result) => {
                                        let a = 1
                                    })
                                })
                            }
                            res.location('/api/v2/tourneys/' + req.body.name).status(201).send()
                            return
                        })
                    }
                })
            } else {
                res.status(409).json({ error: "nome torneo già utilizzato" })
                return
            }
        })
    }
})

function validatePost(req) {
    console.log(req.body)
    if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('startingDate') || !req.body.hasOwnProperty('endingDate') || !req.body.hasOwnProperty('private') || !req.body.hasOwnProperty('format') || !req.body.hasOwnProperty('teams')) { console.log("qui"); return false }
    console.log("body ok")
    if (req.body.name == "") { return false }
    console.log("name ok")
    if (req.body.format == "") { return false }
    console.log("format ok")
    let startingDate = new Date(req.body.startingDate)
    let endingDate = new Date(req.body.endingDate)
    if (startingDate.toString() == "Invalid Date" || endingDate.toString() == "Invalid Date") { return false }
    if (Date.now() > endingDate.getTime() || startingDate.getTime() > endingDate.getTime()) { return false }
    console.log("dates ok")
    if (req.body.private != "true" && req.body.private != "false") { return false }
    console.log("private ok")
    if (!Array.isArray(req.body.teams) || req.body.teams.length == 0) { return false }
    console.log("teams ok")
    return true
}



router.get('/:name', (req, res) => {
    Tourney.findOne({ "name": req.params.name }, (err, result) => {
        if (isNull(result)) {
            res.status(404).json({ error: "Torneo non trovato" })  
        } else {
            res.status(200).json({
                name: result.name,
                startingDate: result.startingDate,
                endingDate: result.endingDate, //date convertite in roba leggibile
                private: result.Boolean,
                format: result.String,
                teams: result.teams, //deve ritornare i nomi dei team associati all'id
                games: result.games //deve tornate i dati del documenti associato all'id
            })
        }
    })
})

//TODO
router.get('/:nameTourney/:nameTeam', (req, res) => {
    
})



//fare in modo che un giocatore non si può iscrivere più volte allo stesso team
router.put('/', (req, res) => { //API per aggiungere giocatore al team di un torneo specifico
    let teamId = "";
    let playerId = "";
    let arrTeams = [];
    User.findOne({"username": req.body.username, "password": req.body.password}).populate("player").exec((err, result) => {
        if(err) { 
            return handleError(err);
        } else if(isNullOrUndefined(result)) {
            res.status(404).json({ error: "Giocatore non trovato"})
            return
        } else {
            if(result.playerAssigned == "false"){
                res.status(400).json({ error: "utente non è associato ad un giocatore" })
                return
            } else {
                playerId = result.player.id
                Tourney.findOne({"name": req.body.name}).populate("teams").exec((err, result) => { //cerca tutti i team corrispondenti al nome del torneo
                    if(err) { 
                        return handleError(err);
                    } else if(isNullOrUndefined(result)) {
                        res.status(404).json({ error: "Torneo non trovato"})
                        return
                    }
                    else {
                        arrTeams = result.teams; //metto da parte i team trovati
                        for(let i=0; i<arrTeams.length; i++){ //cerco il nome del team che mi interessa tra i team di quel torneo
                            if(arrTeams[i].name == req.body.nameTeam) { 
                                teamId = arrTeams[i].id; // se trovo il team che mi interessa memorizzo il suo id
                            } 
                        } 
                        if(teamId == "") {
                            res.status(404).json({ error: "Team non trovato"})
                            return
                        }
                        else if(teamId != "") {
                            Player.findById({ _id: playerId }, (err, result) => { //cerco il player tramite il nome
                                if(err) { 
                                    return handleError(err);
                                } 
                                else if(isNullOrUndefined(result)) {
                                    res.status(404).json({ error: "Giocatore non trovato"})
                                    return
                                }
                                else {
                                    Team.findById({ _id: teamId }, (err, team) => { 
                                        if(!team.players.includes(playerId)) {
                                            Team.updateOne( //inserisco il player al team che mi interessa
                                            { _id: teamId }, 
                                            { $push: { players: playerId  } },
                                            function (error, success) {
                                                if (error) {
                                                    console.log(error);
                                                    res.status(500).send();
                                                } else {
                                                    console.log(success);
                                                    res.status(200).send();
                                                    return
                                                }
                                            });
                                        } else {
                                            res.status(403).json({ error: "Giocatore già presente"})
                                        }
                                    })
                                }   
                            })
                        }
                    }
                })
            }
        }
    })
})



//eliminare documenti teams
//eliminare documenti games
router.delete('/', (req, res) => {
    if(!validateDelete(req)){
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        Tourney.findOne({ name: req.body.name }, (err, result) => {
            if(isNull(result)){
                res.status(404).json({ error: "torneo non trovato"})
                return
            } else {
                User.findOne({ _id: result.owner }, (err, result) => {
                    if(isNull(result)){
                        res.status(500).json({ error: "server error"})
                        return
                    } else {
                        if(result.username == req.body.username && result.password == req.body.password){
                            Tourney.deleteOne({ name: req.body.name }, (err, result) => {
                                res.status(204).send()
                                return
                            })
                        } else {
                            res.status(400).json({ error: "credenziali errate" })
                        }
                    }
                })
            }
        })
    }
})

function validateDelete(req){
    if(!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')){return false}
    return true
}




module.exports = router
