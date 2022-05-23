const express = require('express')
const router = express.Router()
const { isNull, isNullOrUndefined } = require('url/util')
const User = require('../../models/User')


router.post('/', (req, res) => {
    User.findOne({ "username": req.body.username}, 'username', (err, result) => {
        if(isNull(result)){
            const user = new User({
                username: req.body.username,
                password: req.body.password
            })
            user.save()
            .then(data => {
                let id = user.id
                res.location('/api/v1/users/' + id).status(201).send()
            })
        } else {
            res.status(409).json({ error: "Username già esistente" })
            return
        }
    })
})


router.get('/:id', (req, res) => {
    User.findById(req.params.id, 'username password', (err, result) => {
        if(isNull(err)){
            res.status(200).json({ username: result.username, password: result.password})
        } else {
            res.status(404).json({ error: "Utente non trovato"})
        }
    })
})


//nella delete non usiamo l'id per cancellare gli utenti perchè vogliamo che inseriscano la password per evitare che venga eliminata gente a caso
router.delete('/', (req, res) => {
    User.findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
        if(isNull(result)){
            res.status(404).json({error: "Utente non eliminato"})
        } else {            
            User.deleteOne({ username: req.body.username, password: req.body.password }, (err, result) => {            
                if(isNull(err)){
                    res.status(204).json({ message: "Utente Eliminato"})
                } else {
                    res.status(500).json({ message: "Server Error"})
                }
            })
        }
    })
})


router.put('/', (req, res) => {
    if(isNullOrUndefined(req.body.newPassword) || req.body.newPassword == ""){
        res.status(404).json({error: "Utente non modificato"})
    } else {
        User.findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
            if(isNull(result)){
                res.status(404).json({error: "Utente non modificato"})
            } else {
                User.replaceOne({ username: req.body.username, password: req.body.password }, { username: req.body.username, password: req.body.newPassword }, (err, result) => {
                    if(isNull(err)){
                        res.status(200).json({ message: "Password aggiornata"})
                    } else {
                        res.status(500).json({ message: "Server Error"})
                    }
                })
            }
        })
    }
    
})

module.exports = router