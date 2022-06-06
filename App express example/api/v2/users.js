const express = require('express')
const router = express.Router()
const { isNull, isNullOrUndefined } = require('url/util')
const User = require('../../models/User')
const Player = require('../../models/Player')


router.post('/', (req, res) => {
    if(!validatePost(req)){
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        User.findOne({ "username": req.body.username}, 'username', (err, result) => {
            if(isNull(result)){
                const user = new User({
                    username: req.body.username,
                    password: req.body.password,
                    playerAssigned: "false"
                })
                user.save()
                .then(data => {
                    res.status(201).location('./api/v2/users/me').send()
                    return
                })
            } else {
                res.status(409).json({ error: "Username già esistente" })
                return
            }
        })
    }
})

function validatePost(req){
    if(!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')){return false}
    if(req.body.username == "" || req.body.password == ""){return false}
    return true
}


router.delete('/me', async (req, res) => {
    let user = await User.findOne({ username: req.loggedUser.username })
    if(isNull(user)){
        res.status(404).json({error: "Utente non eliminato"})
        return
    } else {
        User.findOne({ username: user.username, password: user.password }, (err, result) => {
            if(isNull(result)){
                res.status(404).json({error: "Utente non eliminato"})
                return
            } else {
                Player.deleteOne({ _id: result.player }, (err, result) => {
                    User.deleteOne({ username: user.username, password: user.password }, (err, result) => {            
                        if(isNull(err)){
                            res.status(204).send()
                            return
                        } else {
                            res.status(500).json({ message: "Server Error"})
                            return
                        }
                    })
                })
            }
        })
    }
})



router.put('/me', async (req, res) => {
    if(!validatePut(req)){
        res.status(400).json({ error: "errore nei dati inseriti" })
        return
    } else {
        let user = await User.findOne({ username: req.loggedUser.username })
        if(isNull(user)){
            res.status(404).json({error: "Utente non eliminato"})
            return
        } else {
            User.findOne({ username: user.username, password: user.password }, (err, result) => {
                if(isNull(result)){
                    res.status(404).json({error: "Utente non modificato"})
                    return
                } else {
                    User.replaceOne({ username: user.username, password: user.password }, {
                        username: user.username,
                        password: req.body.newPassword,
                        playerAssigned: user.playerAssigned,
                        player: user.player
                    }, (err, result) => {
                        if(isNull(err)){
                            res.status(200).send()
                            return
                        } else {
                            res.status(500).json({ message: "Server Error"})
                            return
                        }
                    })
                }
            })
        }
    }
})

function validatePut(req){
    if(!req.body.hasOwnProperty('newPassword')){return false}
    if(req.body.newPassword == ""){return false}
    return true
}

router.get('/me', async (req, res) => {
    let user = await User.findOne({ username: req.loggedUser.username } )
    if(isNull(user)){
        res.status(404).json({ error: "Utente non trovato" })
        return
    } else {
        res.status(200).json({ username: req.loggedUser.username, password: user.password })
        return
    }
})

module.exports = router