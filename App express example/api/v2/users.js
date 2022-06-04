const express = require('express')
const router = express.Router()
const { isNull, isNullOrUndefined } = require('url/util')
const User = require('../../models/User')
const Player = require('../../models/Player')


router.post('/', (req, res) => {
    if (!validatePost(req)) {
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        User.findOne({ "username": req.body.username }, 'username', (err, result) => {
            if (isNull(result)) {
                const user = new User({
                    username: req.body.username,
                    password: req.body.password,
                    playerAssigned: "false"
                })
                user.save()
                    .then(data => {
                        res.status(201).send() //niente location perché non abbiamo una get che lo gestirebbe
                        return
                    })
            } else {
                res.status(409).json({ error: "Username già esistente" })
                return
            }
        })
    }
})

function validatePost(req) {
    if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')) { return false }
    if (req.body.username == "" || req.body.password == "") { return false }
    return true
}


router.delete('/', (req, res) => {
    if (!validateDelete(req)) {
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        User.findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
            if (isNull(result)) {
                res.status(404).json({ error: "Utente non eliminato" })
                return
            } else {
                Player.deleteOne({ _id: result.player }, (err, result) => {
                    User.deleteOne({ username: req.body.username, password: req.body.password }, (err, result) => {
                        if (isNull(err)) {
                            res.status(204).send()
                            return
                        } else {
                            res.status(500).json({ message: "Server Error" })
                            return
                        }
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


router.put('/', (req, res) => {
    if (!validatePut(req)) {
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        User.findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
            if (isNull(result)) {
                res.status(404).json({ error: "Utente non modificato" })
                return
            } else {
                User.replaceOne({ username: req.body.username, password: req.body.password }, { username: req.body.username, password: req.body.newPassword }, (err, result) => {
                    if (isNull(err)) {
                        res.status(200).send()
                        return
                    } else {
                        res.status(500).json({ message: "Server Error" })
                        return
                    }
                })
            }
        })
    }
})

function validatePut(req) {
    if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('newPassword')) { return false }
    if (req.body.newPassword == "") { return false }
    return true
}


module.exports = router