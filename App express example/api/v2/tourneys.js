const express = require('express')
const router = express.Router()
const { isNull } = require('url/util')
const { isNullOrUndefined } = require('url/util')
const Tourney = require('../../models/Tourney')
const Team = require('../../models/Team')
const Player = require('../../models/Player')
const User = require('../../models/User')
const Game = require('../../models/Game')


router.post('/', async function (req, res) {
    if(!validatePost(req)) {
      res.status(400).json({ error: "errore nei dati inseriti" })
      return
    } else {
      let tourney = await Tourney.findOne({ name: req.body.name })
      if (isNull(tourney)) {
        let utente = await User.findOne({ username: req.loggedUser.username })
        if (isNull(utente)) {
          res.status(404).json({ error: "utente non trovato" })
          return
        } else {
          let startingDate = new Date(req.body.startingDate).getTime()
          let endingDate = new Date(req.body.endingDate).getTime()
          const torneo = new Tourney({
            name: req.body.name,
            owner: utente.id,
            startingDate: startingDate,
            endingDate: endingDate,
            format: req.body.format,
            games: [],
            teams: []
          })
          torneo.save()
            .then( async data => {
              for (counter in req.body.teams) {
                  if(req.body.teams[counter] == ""){req.body.teams[counter] = "undefined"}
                let item = req.body.teams[counter]
                let team = new Team({
                  name: item,
                  players: []
                })
                team.save()
                  .then( async data => {
                    let modteam = await Tourney.updateOne({ _id: torneo._id }, { $push: { teams: team._id } })
                  })
              }
              let partite = ((req.body.teams.length) * (req.body.teams.length - 1))
              let increment = ((endingDate - startingDate) / partite) //calcolo l'icremento per fissare le date delle partite in modo ordinato nell'intervallo
              let dataric = startingDate //fisso la data di partenza
              for (let i = 0; i < req.body.teams.length; i++) {
                for (let j = 0; j < req.body.teams.length; j++) {
                  if (i != j) {
                    let gametime = new Date(dataric) //la prima partita è il primo giorno di torneo
                    let game = new Game({
                      date: gametime,
                      teamUno: req.body.teams[i],
                      teamDue: req.body.teams[j]
                    })
                    dataric = dataric + increment //incremento in modo da avere il giorno della prossima partita
                    game.save()
                      .then( async data => {
                        let modgame = await Tourney.updateOne({ _id: torneo._id }, { $push: { games: game._id } })
                      })
                  }
  
                }
  
              }
              res.location('/api/v2/tourneys/' + req.body.name).status(201).send()
              return
            })
        }
      } else {
        res.status(409).json({ error: "nome torneo già utilizzato" })
        return
      }
    }
})

function validatePost(req) {
    if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('startingDate') || !req.body.hasOwnProperty('endingDate') || !req.body.hasOwnProperty('format') || !req.body.hasOwnProperty('teams')) { return false }
    if (req.body.name == "") { return false }
    if (req.body.format == "") { return false }
    let startingDate = new Date(req.body.startingDate)
    let endingDate = new Date(req.body.endingDate)
    if (startingDate.toString() == "Invalid Date" || endingDate.toString() == "Invalid Date") { return false }
    if (Date.now() > endingDate.getTime() || startingDate.getTime() > endingDate.getTime()) { return false }
    if (!Array.isArray(req.body.teams) || req.body.teams.length == 0) { return false }
    return true
}


router.get('/:nameTourney/:nameTeam', (req, res) => {
    Tourney.findOne({ name: req.params.nameTourney }, (err, result) => {
        if(isNull(result)){
            res.status(404).json({ error: "torneo non trovato"})
            return
        } else {
            torneo = result
            Team.findOne( { name: req.params.nameTeam }, (err, result) => {
                team = result
                if(isNull(team)){
                    res.status(404).json({ error: "team non trovato in db"})
                    return
                } else {
                    if(torneo.teams.includes(team._id)){
                        teamPlayers = []
                        mut = 0
                        if(team.players.length != 0){
                            for(counter in team.players){
                                Player.findOne({ _id: team.players[counter] }, (err, result) => {
                                    teamPlayers.push({ name: result.name, surname: result.surname })
                                    mut++
                                    if(mut == team.players.length){
                                        res.status(200).json({ name: team.name, players: teamPlayers})
                                        return
                                    }
                                })
                            }
                        } else {
                            res.status(200).json({ name: team.name, players: teamPlayers})
                            return
                        }
                    } else {
                        res.status(404).json({ error: "team non trovato in torneo"})
                        return
                    }
                }
            })
        }
    })
})


router.get('/:name', (req, res) => {
    Tourney.findOne({ name: req.params.name }, (err, result) => {
        torneo = result
        if (isNull(result)) {
            res.status(404).json({ error: "torneo non trovato" })
            return
        } else {
            let startingDate = new Date(result.startingDate)
            let endingDate = new Date(result.endingDate)
            teams = result.teams
            games = result.games
            jsonGames = []
            jsonTeams = []

            fatto = false
            mut1 = 0
            mut2 = 0
            for(counter in teams){
                Team.findOne({ _id: teams[counter] }, (err, result) =>{
                    jsonTeams.push(result.name)
                    mut1++
                    if(mut1 == teams.length){
                        for(counter in games){
                            Game.findOne({ _id: games[counter] }, (err, result) => {
                                d = new Date(result.date)
                                jsonGames.push({ date: d, teamUno: result.teamUno, teamDue: result.teamDue })
                                mut2++
                                if(mut2 == games.length){
                                    res.status(200).json({
                                        name: torneo.name,
                                        startingDate: startingDate,
                                        endingDate: endingDate,
                                        format: torneo.format,
                                        teams: jsonTeams,
                                        games: jsonGames
                                    })
                                    return
                                }
                            })
                        }
                    }
                })
            }
            
            
        }
    })
})


router.put('/:name/:nameTeam', async function(req, res) { //API per aggiungere giocatore al team di un torneo specifico
    let teamId = "";
    let playerId = "";
    let arrTeams = [];
    let utente = await User.findOne({ username: req.loggedUser.username })
    if (isNull(utente)) {
        res.status(404).json({ error: "utente non trovato" })
        return
      } else {
        User.findOne({"username": req.loggedUser.username, "password": utente.password}).populate("player").exec((err, result) => {
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
                    Tourney.findOne({"name": req.params.name}).populate("teams").exec((err, result) => { //cerca tutti i team corrispondenti al nome del torneo
                        if(err) { 
                            return handleError(err);
                        } else if(isNullOrUndefined(result)) {
                            res.status(404).json({ error: "Torneo non trovato"})
                            return
                        }
                        else {
                            arrTeams = result.teams; //metto da parte i team trovati
                            for(let i=0; i<arrTeams.length; i++){ //cerco il nome del team che mi interessa tra i team di quel torneo
                                if(arrTeams[i].name == req.params.nameTeam) { 
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
                                                        res.status(500).send();
                                                    } else {
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
    }
})


router.delete('/:name', async function (req, res){
    let utente = await User.findOne({ username: req.loggedUser.username })
    if (isNull(utente)) {
        res.status(404).json({ error: "utente non trovato" })
        return
      } else {
        let torneo = await Tourney.findOne({ name: req.params.name }) 
        if(isNull(torneo)){
            res.status(404).json({ error: "torneo non trovato"})
            return
        } else {
            let user = await User.findOne({ _id: torneo.owner })
            if(isNull(user)){
                res.status(500).json({ error: "server error"})
                return
            } else {
                if(user.username == req.loggedUser.username && user.password == utente.password){
                    for(counter in torneo.teams){
                        Team.deleteOne({ _id: torneo.teams[counter] }, (err, result) => {
                            let a = 1
                        })
                    }
                    for(counter in torneo.games){
                        Game.deleteOne({ _id: torneo.games[counter] }, (err, result) => {
                            let a = 1
                        })
                    }
                    Tourney.deleteOne({ name: req.params.name }, (err, result) => {
                        res.status(204).send()
                        return
                    })
                } else {
                    res.status(400).json({ error: "credenziali errate" })
                    return
                }
            }
        }
    }
})

module.exports = router
