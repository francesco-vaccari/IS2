const express = require('express')
const router = express.Router()
const { isNull, isNullOrUndefined } = require('url/util')
const Player = require('../../models/Player')
const User = require('../../models/User')


router.get('/:username', (req, res) => {
    User.findOne({ username: req.params.username }, (err, result) => {
        if (isNull(result)) {
            res.status(404).json({ error: "giocatore non trovato" })
            return
        } else {
            if (result.playerAssigned == "true") {
                Player.findOne({ _id: result.player }, (err, result) => {
                    if (isNull(result)) {
                        res.status(500).json({ error: "server error" })
                    } else {
                        res.status(200).json({ name: result.name, surname: result.surname })
                    }
                })
            } else {
                res.status(404).json({ error: "l'utente inserito non è associato ad alcun giocatore" })
                return
            }
        }
    })
})


router.post('/', (req, res) => {
    if (!validatePost(req)) {
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        User.findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
            if (isNull(result)) {
                res.status(404).json({ error: "utente non trovato" })
                return
            } else {
                User.findOne({ username: req.body.username, password: req.body.password, playerAssigned: "true" }, (err, result) => {
                    if (isNull(result)) {
                        const player = new Player({
                            name: req.body.name,
                            surname: req.body.surname
                        })
                        player.save()
                            .then(User.updateOne({ username: req.body.username, password: req.body.password }, { player: player, playerAssigned: "true" })
                                .then(res.location('/api/v2/players/' + req.body.username).status(201).send()))
                        return
                    } else {
                        res.status(409).json({ error: "esiste un giocatore già assegnato a questo utente" })
                        return
                    }
                })
            }
        })
    }
})

function validatePost(req) {
    if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('surname')) { return false }
    if (req.body.name == "" || req.body.surname == "") { return false }
    return true
}


router.delete('/', (req, res) => {
    if (!validateDelete(req)) {
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        User.findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
            console.log(result)
            if (isNull(result)) {
                res.status(404).json({ error: "utente non trovato" })
                return
            }
            if (result.playerAssigned == "false") {
                res.status(400).json({ error: "l'utente inserito non è associato ad alcun giocatore" })
                return
            }
            if (result.playerAssigned == "true") {
                Player.deleteOne({ _id: result.player }, (err, result) => {
                    User.updateOne({ username: req.body.username, password: req.body.password }, { playerAssigned: "false" }, (err, result) => {
                        res.status(204).send()
                        return
                    })
                })
            }
        })
    }
})

function validateDelete(req) {
    if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')) { return false }
    return true
}


module.exports = router